import { env } from '@/config/env';
import { SocketConnectionState, SocketEventCallback } from './socketTypes';

class SocketClientManager {
  private socketUrl: string = env.VITE_SOCKET_URL;
  private listeners: Map<string, Set<SocketEventCallback>> = new Map();
  private connectionState: SocketConnectionState = 'disconnected';
  private ws: WebSocket | null = null;
  private reconnectTimer: any = null;

  public connect(token?: string) {
    if (!env.VITE_ENABLE_REALTIME) return;
    if (this.connectionState === 'connected' || this.connectionState === 'connecting') return;

    this.connectionState = 'connecting';
    const protocol = this.socketUrl.startsWith('https') ? 'wss' : 'ws';
    const cleanHost = this.socketUrl.replace(/^https?:\/\//, '');
    const wsUrl = `${protocol}://${cleanHost}/socket.io/?EIO=4&transport=websocket${token ? `&token=${token}` : ''}`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.connectionState = 'connected';
        this.emitStateChange('connected');
      };

      this.ws.onmessage = (event) => {
        try {
          const raw = event.data;
          // Handle Socket.IO frame parsing
          if (typeof raw === 'string' && raw.startsWith('42')) {
            const parsed = JSON.parse(raw.substring(2));
            const [eventName, payload] = parsed;
            this.notifyListeners(eventName, payload);
          }
        } catch {
          // Ignore non-json socket frames
        }
      };

      this.ws.onclose = () => {
        this.connectionState = 'disconnected';
        this.emitStateChange('disconnected');
        this.scheduleReconnect();
      };

      this.ws.onerror = () => {
        this.connectionState = 'error';
        this.emitStateChange('error');
      };
    } catch (e) {
      this.connectionState = 'error';
      this.scheduleReconnect();
    }
  }

  public disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.connectionState = 'disconnected';
  }

  public subscribe(event: string, callback: SocketEventCallback): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  public joinRoom(roomName: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(`42["join_room", "${roomName}"]`);
    }
  }

  public leaveRoom(roomName: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(`42["leave_room", "${roomName}"]`);
    }
  }

  private notifyListeners(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((cb) => cb(data));
    }
  }

  private emitStateChange(state: SocketConnectionState) {
    this.notifyListeners('connection_status', state);
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => this.connect(), 5000);
  }

  public getState(): SocketConnectionState {
    return this.connectionState;
  }
}

export const socketClient = new SocketClientManager();
