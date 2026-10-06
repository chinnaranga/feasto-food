import { env } from '../../../config/env.js';
import { logger } from '../../../shared/utils/logger.js';
import { AIChatMessage } from '../ai.types.js';

export interface NemotronCompletionOptions {
  messages: AIChatMessage[];
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  responseFormatJson?: boolean;
}

export interface NemotronCompletionResult {
  content: string;
  parsedJson?: unknown;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  latencyMs: number;
}

export class NemotronService {
  private baseUrl: string;
  private apiKey: string;
  private model: string;
  private timeoutMs: number;
  private maxRetries: number;

  constructor() {
    this.baseUrl = (env.NEMOTRON_BASE_URL || 'https://integrate.api.nvidia.com/v1').replace(/\/+$/, '');
    this.apiKey = env.NEMOTRON_API_KEY || '';
    this.model = env.AI_MODEL || 'nvidia/nemotron-3-ultra-550b-a55b';
    this.timeoutMs = env.NEMOTRON_TIMEOUT_MS || 15000;
    this.maxRetries = env.NEMOTRON_MAX_RETRIES || 2;
  }

  public isAvailable(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 5 && !this.apiKey.includes('YOUR_SECRET_KEY'));
  }

  public getModelName(): string {
    return this.model;
  }

  /**
   * Invoke NVIDIA Nemotron Chat Completion with retries, timeout, and observability.
   */
  public async generateCompletion(
    options: NemotronCompletionOptions
  ): Promise<NemotronCompletionResult> {
    if (!this.isAvailable()) {
      throw new Error('NEMOTRON_API_KEY is not configured or invalid on the backend.');
    }

    const endpoint = `${this.baseUrl}/chat/completions`;
    const payload: Record<string, unknown> = {
      model: this.model,
      messages: options.messages,
      temperature: options.temperature ?? 0.2,
      top_p: options.topP ?? 0.7,
      max_tokens: options.maxTokens ?? 1500,
      stream: false,
      chat_template_kwargs: {
        enable_thinking: !options.responseFormatJson,
      },
    };

    let attempt = 0;
    let lastError: Error | null = null;
    const startTime = Date.now();

    while (attempt <= this.maxRetries) {
      attempt++;
      const controller = new AbortController();
      const timeoutHandle = setTimeout(() => controller.abort(), this.timeoutMs);

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
            'User-Agent': 'Feasto-Food-Platform/2.0',
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeoutHandle);

        if (!response.ok) {
          const errorBody = await response.text();
          logger.warn(
            { status: response.status, attempt, errorBody: errorBody.slice(0, 300) },
            '⚠️ NVIDIA Nemotron API returned non-200 response'
          );

          // Retry on Rate Limit (429) or Server Error (5xx)
          if ((response.status === 429 || response.status >= 500) && attempt <= this.maxRetries) {
            const backoffMs = attempt * 800;
            await new Promise((r) => setTimeout(r, backoffMs));
            continue;
          }

          throw new Error(`Nemotron API error (HTTP ${response.status}): ${errorBody.slice(0, 200)}`);
        }

        const data = (await response.json()) as {
          choices?: Array<{ message?: { content?: string } }>;
          usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
        };

        const rawContent = data.choices?.[0]?.message?.content || '';
        const latencyMs = Date.now() - startTime;

        let parsedJson: unknown = undefined;
        if (options.responseFormatJson) {
          parsedJson = this.extractCleanJson(rawContent);
        }

        logger.info(
          {
            model: this.model,
            latencyMs,
            tokens: data.usage?.total_tokens,
          },
          '⚡ NVIDIA Nemotron completion successful'
        );

        return {
          content: rawContent,
          parsedJson,
          usage: data.usage
            ? {
                promptTokens: data.usage.prompt_tokens,
                completionTokens: data.usage.completion_tokens,
                totalTokens: data.usage.total_tokens,
              }
            : undefined,
          latencyMs,
        };
      } catch (err: unknown) {
        clearTimeout(timeoutHandle);
        lastError = err instanceof Error ? err : new Error(String(err));

        if (attempt <= this.maxRetries) {
          const backoffMs = attempt * 600;
          logger.info({ attempt, backoffMs, err: lastError.message }, 'Retrying Nemotron call after delay...');
          await new Promise((r) => setTimeout(r, backoffMs));
        }
      }
    }

    throw lastError || new Error('Nemotron request failed after retries.');
  }

  /**
   * Server-Sent Events (SSE) streaming generator.
   */
  public async *streamCompletion(
    options: NemotronCompletionOptions
  ): AsyncGenerator<string, void, unknown> {
    if (!this.isAvailable()) {
      throw new Error('NEMOTRON_API_KEY is not configured or invalid on the backend.');
    }

    const endpoint = `${this.baseUrl}/chat/completions`;
    const payload: Record<string, unknown> = {
      model: this.model,
      messages: options.messages,
      temperature: options.temperature ?? 0.2,
      top_p: options.topP ?? 0.7,
      max_tokens: options.maxTokens ?? 1500,
      stream: true,
      chat_template_kwargs: {
        enable_thinking: true,
      },
    };

    const controller = new AbortController();
    const timeoutHandle = setTimeout(() => controller.abort(), this.timeoutMs * 2);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutHandle);

      if (!response.ok || !response.body) {
        const errText = await response.text();
        throw new Error(`Nemotron streaming failed (${response.status}): ${errText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const clean = line.trim();
          if (!clean.startsWith('data:')) continue;
          const dataStr = clean.replace(/^data:\s*/, '').trim();
          if (dataStr === '[DONE]') return;

          try {
            const parsed = JSON.parse(dataStr) as {
              choices?: Array<{ delta?: { content?: string } }>;
            };
            const textChunk = parsed.choices?.[0]?.delta?.content;
            if (textChunk) {
              yield textChunk;
            }
          } catch {
            // Partial JSON chunk, wait for next tick
          }
        }
      }
    } catch (err) {
      clearTimeout(timeoutHandle);
      throw err;
    }
  }

  /**
   * Helper to strip markdown ```json fences and extract raw JSON.
   */
  public extractCleanJson(text: string): unknown {
    try {
      const cleaned = text
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/, '')
        .replace(/```\s*$/, '')
        .trim();
      return JSON.parse(cleaned);
    } catch {
      // If direct parse fails, attempt regex extraction between outermost { and }
      const match = text.match(/(\{[\s\S]*\})/);
      if (match) {
        try {
          return JSON.parse(match[1]);
        } catch {
          // unparseable
        }
      }
      return null;
    }
  }
}

export const nemotronService = new NemotronService();
