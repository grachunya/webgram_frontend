import { Invitation, Inviter, UserAgent } from "sip.js";
import type { Session, SessionState } from "sip.js";
import type { SessionDescriptionHandler } from "sip.js/lib/platform/web";
import { getOrCreateAudioElement } from "./AudioElement";

export type CallState = "idle" | "incoming" | "outgoing" | "active" | "error";

export type CallEventCallbacks = {
  onIncomingCall?: (caller: string) => void;
  onCallStateChange?: (state: CallState) => void;
  onCallEnd?: () => void;
  onError?: (error: string | Error) => void;
};

export class CallManager {
  private currentSession: Inviter | Invitation | null = null;
  private callbacks: CallEventCallbacks;
  private remoteAudio: HTMLAudioElement;
  private localAudio: HTMLAudioElement;

  constructor(
    private userAgent: UserAgent,
    callbacks: CallEventCallbacks = {},
    audioElements?: {
      remoteAudio?: HTMLAudioElement;
      localAudio?: HTMLAudioElement;
    },
  ) {
    this.callbacks = callbacks;

    this.remoteAudio =
      audioElements?.remoteAudio ||
      getOrCreateAudioElement("remote-audio", false);

    this.localAudio =
      audioElements?.localAudio || getOrCreateAudioElement("local-audio", true);

    this.userAgent.delegate = {
      onInvite: (invitation) => {
        if (this.currentSession) {
          invitation.reject({ statusCode: 603 }).catch(console.warn);
          return;
        }

        this.handleIncomingCall(invitation);
      },
    };
  }

  private attachRemoteStream(stream: MediaStream | null): void {
    if (!stream) return;

    this.remoteAudio.srcObject = stream;
    this.remoteAudio.play().catch(console.warn);
  }

  private setupAudioStreams(sdh: SessionDescriptionHandler): void {
    const pc = sdh.peerConnection;

    if (!pc) {
      console.warn("PeerConnection is not available");
      return;
    }

    pc.ontrack = (event) => {
      const stream = event.streams[0];
      this.attachRemoteStream(stream ?? null);
    };
  }

  private bindSessionState(session: Session): void {
    session.stateChange.addListener((state: SessionState) => {
      if (state === "Established") {
        this.updateState("active");
      } else if (state === "Terminated") {
        this.cleanup();
      }
    });
  }

  private handleIncomingCall(invitation: Invitation): void {
    this.currentSession = invitation;

    const caller = invitation.remoteIdentity?.uri?.user || "Неизвестный";
    this.callbacks.onIncomingCall?.(caller);
    this.updateState("incoming");

    invitation.delegate = {
      ...invitation.delegate,
      onSessionDescriptionHandler: (sdh: SessionDescriptionHandler) => {
        this.setupAudioStreams(sdh);
      },
    };

    this.bindSessionState(invitation);
  }

  async makeCall(target: string, domain: string): Promise<void> {
    if (this.currentSession) {
      this.callbacks.onError?.("Звонок уже идёт");
      return;
    }

    const targetUri = UserAgent.makeURI(`sip:${target}@${domain}`);

    if (!targetUri) {
      this.callbacks.onError?.("Некорректный номер");
      this.updateState("error");
      return;
    }

    this.updateState("outgoing");

    const inviter = new Inviter(this.userAgent, targetUri, {
      earlyMedia: true,
      delegate: {
        onSessionDescriptionHandler: (sdh: SessionDescriptionHandler) => {
          this.setupAudioStreams(sdh);
        },
      },
      sessionDescriptionHandlerOptions: {
        constraints: { audio: true, video: false },
      },
    });

    this.currentSession = inviter;
    this.bindSessionState(inviter);

    try {
      await inviter.invite();
    } catch (error) {
      this.handleCallError(error);
    }
  }

  async answer(): Promise<void> {
    if (!(this.currentSession instanceof Invitation)) {
      this.callbacks.onError?.("Нет входящего звонка");
      return;
    }

    if (this.currentSession.state !== "Initial") return;

    try {
      await this.currentSession.accept({
        sessionDescriptionHandlerOptions: {
          constraints: { audio: true, video: false },
        },
      });

      this.updateState("active");
    } catch (error) {
      this.handleCallError(error);
    }
  }

  async hangup(): Promise<void> {
    if (!this.currentSession) return;

    try {
      if (this.currentSession instanceof Inviter) {
        if (this.currentSession.state === "Established") {
          await this.currentSession.bye();
        } else {
          await this.currentSession.cancel();
        }
      } else {
        if (this.currentSession.state === "Established") {
          await this.currentSession.bye();
        } else {
          await this.currentSession.reject({ statusCode: 603 });
        }
      }
    } catch (error) {
      console.warn("Hangup error:", error);
    } finally {
      this.cleanup();
    }
  }

  async transfer(target: string, domain: string): Promise<void> {
    if (!this.currentSession) {
      this.callbacks.onError?.("Нет активного вызова для перевода");
      return;
    }

    const referToUri = UserAgent.makeURI(`sip:${target}@${domain}`);

    if (!referToUri) {
      this.callbacks.onError?.("Некорректный номер для перевода");
      return;
    }

    try {
      await this.currentSession.refer(referToUri, {
        requestOptions: {
          extraHeaders: [`Referred-By: <${this.userAgent.configuration.uri}>`],
        },
      });

      this.cleanup();
    } catch (error) {
      console.error("Transfer failed:", error);
      this.callbacks.onError?.(
        "Не удалось перевести вызов: " +
          (error instanceof Error ? error.message : String(error)),
      );
    }
  }

  private handleCallError(error: unknown): void {
    let errorMsg = "Не удалось установить вызов";

    if (error instanceof Error) {
      if (error.name === "NotFoundError") {
        errorMsg = "Нет микрофона";
      } else if (error.name === "NotAllowedError") {
        errorMsg = "Доступ к микрофону запрещён";
      } else {
        errorMsg = error.message;
      }
    }

    this.callbacks.onError?.(errorMsg);
    this.updateState("error");
    this.cleanup();
  }

  private cleanup(): void {
    this.remoteAudio.srcObject = null;
    this.localAudio.srcObject = null;
    this.currentSession = null;
    this.updateState("idle");
    this.callbacks.onCallEnd?.();
  }

  private updateState(state: CallState): void {
    this.callbacks.onCallStateChange?.(state);
  }
}
