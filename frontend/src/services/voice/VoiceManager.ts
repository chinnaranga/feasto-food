/**
 * Feasto Real-Time Voice Manager
 * Orchestrates Web Speech API (STT), SpeechSynthesis (TTS), Web Audio VAD,
 * and Instant Barge-In / Interruption handling.
 */

export type VoiceState =
  | 'IDLE'
  | 'LISTENING'
  | 'THINKING'
  | 'SPEAKING'
  | 'INTERRUPTED'
  | 'ERROR'
  | 'PERMISSION_REQUIRED'
  | 'DISCONNECTED';

export interface VoiceManagerCallbacks {
  onStateChange: (state: VoiceState) => void;
  onInterimTranscript: (text: string) => void;
  onFinalTranscript: (text: string) => void;
  onAudioLevel: (level: number) => void;
  onError: (error: string) => void;
}

export class VoiceManager {
  private state: VoiceState = 'IDLE';
  private recognition: any = null;
  private isRecognitionActive = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private microphoneStream: MediaStream | null = null;
  private animFrameId: number | null = null;
  private callbacks: VoiceManagerCallbacks;
  private selectedLanguage = 'en-IN';
  private silenceTimer: any = null;
  private accumulatedFinalTranscript = '';

  constructor(callbacks: VoiceManagerCallbacks) {
    this.callbacks = callbacks;
    this.initSpeechRecognition();
  }

  public getState(): VoiceState {
    return this.state;
  }

  public setLanguage(lang: string) {
    this.selectedLanguage = lang;
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  private setState(newState: VoiceState) {
    if (this.state === newState) return;
    this.state = newState;
    this.callbacks.onStateChange(newState);
  }

  /**
   * Initializes browser SpeechRecognition with fallback for webkit prefix.
   */
  private initSpeechRecognition() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      this.setState('DISCONNECTED');
      return;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = this.selectedLanguage;
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        this.isRecognitionActive = true;
        if (this.state !== 'SPEAKING') {
          this.setState('LISTENING');
        }
      };

      this.recognition.onresult = (event: any) => {
        // --- BARGE-IN / INTERRUPTION CHECK ---
        // If user speaks while Feasto is speaking, immediately stop TTS audio!
        if (this.state === 'SPEAKING' || window.speechSynthesis.speaking) {
          this.handleInterruption();
        }

        let interimStr = '';
        let finalStr = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalStr += item[0].transcript;
          } else {
            interimStr += item[0].transcript;
          }
        }

        if (interimStr) {
          this.callbacks.onInterimTranscript(interimStr);
          this.resetSilenceTimer(interimStr);
        }

        if (finalStr) {
          this.accumulatedFinalTranscript = (this.accumulatedFinalTranscript + ' ' + finalStr).trim();
          this.callbacks.onFinalTranscript(this.accumulatedFinalTranscript);
          this.resetSilenceTimer(this.accumulatedFinalTranscript, true);
        }
      };

      this.recognition.onerror = (event: any) => {
        if (event.error === 'no-speech') {
          return; // Ignore regular ambient silence
        }

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          this.setState('PERMISSION_REQUIRED');
          this.callbacks.onError('Microphone permission denied. Please allow microphone access.');
          return;
        }

        this.setState('ERROR');
        this.callbacks.onError(`Speech error: ${event.error}`);
      };

      this.recognition.onend = () => {
        this.isRecognitionActive = false;
        // If we were supposed to be listening, automatically restart
        if (this.state === 'LISTENING') {
          try {
            this.recognition.start();
          } catch {
            // will start on next activation
          }
        }
      };
    } catch (err) {
      this.setState('ERROR');
    }
  }

  /**
   * Natural VAD silence detection to finalize speaker turn.
   */
  private resetSilenceTimer(currentText: string, isFinal = false) {
    if (this.silenceTimer) clearTimeout(this.silenceTimer);

    // Wait 1.4s after speech pause before submitting turn
    const waitMs = isFinal ? 900 : 1600;

    this.silenceTimer = setTimeout(() => {
      if (currentText.trim() && this.state === 'LISTENING') {
        const fullTranscript = this.accumulatedFinalTranscript || currentText;
        this.accumulatedFinalTranscript = '';
        this.callbacks.onFinalTranscript(fullTranscript.trim());
      }
    }, waitMs);
  }

  /**
   * Starts microphone input & speech recognition.
   */
  public async startListening(): Promise<boolean> {
    // If speaking, stop playback first
    this.cancelSpeech();

    this.accumulatedFinalTranscript = '';
    this.callbacks.onInterimTranscript('');

    try {
      // Connect Web Audio analyser for audio levels
      await this.startAudioMeter();

      if (this.recognition && !this.isRecognitionActive) {
        this.recognition.lang = this.selectedLanguage;
        this.recognition.start();
      }

      this.setState('LISTENING');
      return true;
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        this.setState('PERMISSION_REQUIRED');
      } else {
        this.setState('ERROR');
      }
      return false;
    }
  }

  /**
   * Stops listening without clearing state.
   */
  public stopListening() {
    if (this.silenceTimer) clearTimeout(this.silenceTimer);
    if (this.recognition && this.isRecognitionActive) {
      try {
        this.recognition.stop();
      } catch {}
    }
    this.isRecognitionActive = false;
    this.stopAudioMeter();
    if (this.state === 'LISTENING') {
      this.setState('IDLE');
    }
  }

  /**
   * Sets thinking state while waiting for Nemotron and tools.
   */
  public setThinking() {
    this.setState('THINKING');
  }

  /**
   * Real-time Text-to-Speech playback.
   */
  public speak(
    text: string,
    onStart?: () => void,
    onEnd?: () => void
  ): Promise<void> {
    return new Promise((resolve) => {
      if (!window.speechSynthesis) {
        resolve();
        return;
      }

      // Cancel any ongoing speech
      this.cancelSpeech();

      // Clean text for natural speech (strip markdown symbols)
      const cleanText = text
        .replace(/[*_#`~[\]]/g, '')
        .replace(/\(₹\d+\)/g, '')
        .replace(/₹(\d+)/g, '$1 rupees')
        .trim();

      if (!cleanText) {
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      this.currentUtterance = utterance;

      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Select natural voice matching language
      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find(
        (v) =>
          v.lang.toLowerCase() === this.selectedLanguage.toLowerCase() ||
          v.lang.toLowerCase().startsWith(this.selectedLanguage.slice(0, 2))
      );
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => {
        this.setState('SPEAKING');
        if (onStart) onStart();
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        if (this.state === 'SPEAKING') {
          this.setState('IDLE');
        }
        if (onEnd) onEnd();
        resolve();
      };

      utterance.onerror = () => {
        this.currentUtterance = null;
        if (this.state === 'SPEAKING') {
          this.setState('IDLE');
        }
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  /**
   * Interrupts assistant speech immediately (Barge-In).
   */
  public handleInterruption() {
    this.cancelSpeech();
    this.setState('INTERRUPTED');
    // Transition to listening right away to capture the user's interruption
    setTimeout(() => {
      if (this.state === 'INTERRUPTED') {
        this.setState('LISTENING');
      }
    }, 150);
  }

  /**
   * Cancels any active speech synthesis output.
   */
  public cancelSpeech() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
  }

  /**
   * Real audio meter using Web Audio API for visual soundwaves.
   */
  private async startAudioMeter() {
    try {
      if (!this.microphoneStream) {
        this.microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!this.audioContext) {
        this.audioContext = new AudioCtx();
      }

      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      const source = this.audioContext.createMediaStreamSource(this.microphoneStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 64;
      source.connect(this.analyser);

      const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

      const checkLevel = () => {
        if (!this.analyser) return;
        this.analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(1, avg / 80);
        this.callbacks.onAudioLevel(normalized);

        // Ambient speech barge-in detection during speaking state
        if (this.state === 'SPEAKING' && normalized > 0.45) {
          this.handleInterruption();
        }

        this.animFrameId = requestAnimationFrame(checkLevel);
      };

      checkLevel();
    } catch {
      // Audio metering is an enhancement; proceed if not supported
    }
  }

  private stopAudioMeter() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.microphoneStream) {
      this.microphoneStream.getTracks().forEach((t) => t.stop());
      this.microphoneStream = null;
    }
    this.callbacks.onAudioLevel(0);
  }

  /**
   * Clean destruction of all audio tracks and listeners.
   */
  public destroy() {
    this.stopListening();
    this.cancelSpeech();
    this.stopAudioMeter();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}
