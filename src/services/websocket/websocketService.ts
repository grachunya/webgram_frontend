type WsMessageListener = (data: unknown) => void;

export class WebSocketService {
  private socket: WebSocket | null = null;
  private listeners: WsMessageListener[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private isConnecting = false;

  constructor(private url: string) {}

  connect(): void {
    if (this.isConnecting || this.socket?.readyState === WebSocket.OPEN) return;

    this.isConnecting = true;

    try {
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        console.log("✅ WebSocket подключён");
        this.isConnecting = false;
        this.reconnectAttempts = 0;
      };

      this.socket.onmessage = (event: MessageEvent<string>) => {
        try {
          const data: unknown = JSON.parse(event.data);
          this.listeners.forEach((listener) => listener(data));
        } catch (error) {
          console.error("❌ Ошибка парсинга WebSocket-сообщения:", error);
        }
      };

      this.socket.onclose = () => {
        console.log("🔴 WebSocket отключён");
        this.isConnecting = false;
        this.handleReconnect();
      };

      this.socket.onerror = (error: Event) => {
        console.error("❌ WebSocket ошибка:", error);
      };
    } catch (error) {
      console.error("❌ Не удалось создать WebSocket", error);
      this.isConnecting = false;
    }
  }

  onMessage(listener: WsMessageListener): () => void {
    this.listeners.push(listener);

    return () => {
      const index = this.listeners.indexOf(listener);
      if (index !== -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), this.reconnectAttempts * 3000);
    } else {
      console.error("💥 Достигнуто макс. кол-во попыток переподключения");
    }
  }

  disconnect(): void {
    this.reconnectAttempts = this.maxReconnectAttempts;
    this.isConnecting = false;

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export const globalWebSocketService = new WebSocketService(
  `wss://вебграм.рф`,
);
