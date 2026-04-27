import { CallManager } from "./CallManager";
import { SipConnection } from "./SipConnection";
import { mapCallState, mapConnStatus } from "./status.dto";
import type { SipCallbacks } from "./types";

export interface Config {
  username: string;
  password: string;
  domain: string;
  wsServer: string;
}

export class SipClient {
  private connection: SipConnection;
  private callManager: CallManager | null = null;
  private isCleaningUp = false;

  constructor(
    config: Config,
    private callbacks: SipCallbacks = {},
  ) {
    this.connection = new SipConnection(config);

    if (typeof window !== "undefined") {
      window.addEventListener("pagehide", this.handlePageUnload);
    }
  }

  async init(): Promise<void> {
    try {
      await this.connection.connectAndRegister(() => {
        this.notifyStatus("Зарегистрирован");
      });

      this.notifyStatus("Подключен");

      const remoteAudio = this.connection.getRemoteAudio?.();
      const localAudio = this.connection.getLocalAudio?.();

      this.callManager = new CallManager(
        this.connection.userAgentRef!,
        {
          onIncomingCall: (caller) => {
            this.callbacks.onIncomingCall?.(caller);
          },
          onCallStateChange: (state) => {
            this.callbacks.onCallStatusChange?.(mapCallState(state));
          },
          onCallEnd: () => {
            this.callbacks.onCallEnd?.();
          },
          onError: (error) => {
            this.callbacks.onError?.(
              typeof error === "string" ? error : error.message,
            );
          },
        },
        { remoteAudio, localAudio },
      );
    } catch (error) {
      console.error("SIP init failed", error);
      this.notifyStatus("Ошибка");
      throw error;
    }
  }

  updateCallbacks(newCallbacks: Partial<SipCallbacks>): void {
    this.callbacks = { ...this.callbacks, ...newCallbacks };
  }

  async makeCall(target: string): Promise<void> {
    await this.callManager?.makeCall(target, this.connection["config"].domain);
  }

  async transfer(target: string): Promise<void> {
    await this.callManager?.transfer(target, this.connection["config"].domain);
  }

  async answerCall(): Promise<void> {
    await this.callManager?.answer();
  }

  async endCall(): Promise<void> {
    await this.callManager?.hangup();
  }

  private handlePageUnload = (): void => {
    if (this.isCleaningUp) return;
    this.isCleaningUp = true;

    void this.callManager?.hangup();
    void this.connection.disconnect().catch(() => {});
  };

  async destroy(): Promise<void> {
    if (typeof window !== "undefined") {
      window.removeEventListener("pagehide", this.handlePageUnload);
    }

    await this.callManager?.hangup();
    await this.connection.disconnect();
    this.notifyStatus("Не подключен");
  }

  private notifyStatus(status: ReturnType<typeof mapConnStatus>): void {
    this.callbacks.onStatusChange?.(status);
  }
}
