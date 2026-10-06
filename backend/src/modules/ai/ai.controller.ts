import { Request, Response } from 'express';
import { aiService, AIService } from './services/ai.service.js';
import { sendSuccess } from '../../shared/utils/response.js';
import { HttpStatus } from '../../shared/constants/httpStatusCodes.js';
import { UnauthorizedError } from '../../shared/errors/UnauthorizedError.js';
import { logger } from '../../shared/utils/logger.js';

export class AIController {
  constructor(private service: AIService = aiService) {}

  public getHealth = async (_req: Request, res: Response): Promise<void> => {
    const health = this.service.getHealthStatus();
    sendSuccess(res, health, 'AI Service status retrieved');
  };

  public discover = async (req: Request, res: Response): Promise<void> => {
    const { prompt, location } = req.body;
    const userId = req.user?.id;
    const result = await this.service.discoverFood(prompt, location, userId);
    sendSuccess(res, result, 'Culinary discovery complete');
  };

  public search = async (req: Request, res: Response): Promise<void> => {
    const { query, location } = req.body;
    const city = location?.city || 'Hyderabad';
    const result = await this.service.search(query, city);
    sendSuccess(res, result, 'AI Search results retrieved');
  };

  public recommend = async (req: Request, res: Response): Promise<void> => {
    const { city = 'Hyderabad', limit = 6 } = req.body;
    const userId = req.user?.id;
    const result = await this.service.recommend(userId, city, limit);
    sendSuccess(res, result, 'Personalized recommendations generated');
  };

  public cartAssist = async (req: Request, res: Response): Promise<void> => {
    const { instruction, restaurantId, cartItems } = req.body;
    const userId = req.user?.id;
    const result = await this.service.assistCart({
      instruction,
      restaurantId,
      cartItems,
      userId,
    });
    sendSuccess(res, result, 'Cart assistance generated');
  };

  public restaurantAssist = async (req: Request, res: Response): Promise<void> => {
    const { restaurantId, question } = req.body;
    const result = await this.service.assistRestaurant(restaurantId, question);
    sendSuccess(res, result, 'Restaurant sommelier answer retrieved');
  };

  public orderAssist = async (req: Request, res: Response): Promise<void> => {
    const { budget, peopleCount, cuisinePreference, restaurantId, isVegOnly } = req.body;
    const userId = req.user?.id;
    const result = await this.service.assistOrder({
      budget,
      peopleCount,
      cuisinePreference,
      restaurantId,
      isVegOnly,
      userId,
    });
    sendSuccess(res, result, 'Order planner proposal generated');
  };

  public trackingAssist = async (req: Request, res: Response): Promise<void> => {
    const { orderId, question } = req.body;
    const userId = req.user?.id;
    const result = await this.service.assistTracking(orderId, question, userId);
    sendSuccess(res, result, 'Order telemetry response retrieved');
  };

  public getTasteProfile = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required to view taste profile');
    }
    const profile = await this.service.getTasteProfile(req.user.id);
    sendSuccess(res, profile, 'User taste profile retrieved');
  };

  public chat = async (req: Request, res: Response): Promise<void> => {
    const { message, history } = req.body;
    const userId = req.user?.id;
    const result = await this.service.chat(message, history, userId);
    sendSuccess(res, result, 'AI Chat response retrieved');
  };

  /**
   * Real-time Server-Sent Events (SSE) streaming endpoint.
   */
  public stream = async (req: Request, res: Response): Promise<void> => {
    const { message, history } = req.body;
    const userId = req.user?.id;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable proxy buffering for instant delivery

    try {
      for await (const chunk of this.service.streamChat(message, history, userId)) {
        res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
      }
      res.write(`data: [DONE]\n\n`);
      res.end();
    } catch (err: unknown) {
      logger.error({ err }, 'Streaming chat error in controller');
      res.write(`data: ${JSON.stringify({ error: 'Streaming interrupted' })}\n\n`);
      res.end();
    }
  };
}

export const aiController = new AIController();
