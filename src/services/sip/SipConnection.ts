import { Registerer, URI, UserAgent, type UserAgentOptions } from "sip.js";
import { getOrCreateAudioElement } from "./AudioElement";
import type { Config } from "./SipClient";

export type SipConnectionStatus =
  | "disconnected"
  | "connected"
  | "registered"
  | "error";

export class SipConnection {
  private userAgent: UserAgent | null = null;
  private registerer: Registerer | null = null;
  private static remoteAudio: HTMLAudioElement;
  private static localAudio: HTMLAudioElement;

  constructor(private config: Config) {
    if (!SipConnection.remoteAudio) {
      SipConnection.remoteAudio = getOrCreateAudioElement(
        "sip-remote-audio",
        false,
      );
    }
    if (!SipConnection.localAudio) {
      SipConnection.localAudio = getOrCreateAudioElement(
        "sip-local-audio",
        true,
      );
    }
  }

  getRemoteAudio(): HTMLAudioElement {
    return SipConnection.remoteAudio;
  }

  getLocalAudio(): HTMLAudioElement {
    return SipConnection.localAudio;
  }

  async connectAndRegister(onRegistered?: () => void): Promise<void> {
    const { username, password, domain, wsServer } = this.config;
    const uri = new URI("sip", username, domain);

    const uaOptions: UserAgentOptions = {
      uri,
      authorizationUsername: username,
      authorizationPassword: password,
      transportOptions: { server: wsServer },
      contactName: username,
      viaHost: domain,
      contactParams: { transport: "wss" },
      logBuiltinEnabled: true,
      logConfiguration: true,
      reconnectionDelay: 5,
      reconnectionAttempts: 999,
      sessionDescriptionHandlerFactoryOptions: {
        peerConnectionConfiguration: {
          iceServers: [],
        },
      },
    };

    this.userAgent = new UserAgent(uaOptions);

    await this.userAgent.start();

    this.registerer = new Registerer(this.userAgent);

    this.registerer.stateChange.addListener((state) => {
      if (state === "Registered") {
        onRegistered?.();
      }
    });

    await this.registerer.register();
  }

  get userAgentRef(): UserAgent | null {
    return this.userAgent;
  }

  async disconnect(): Promise<void> {
    if (SipConnection.remoteAudio.srcObject) {
      SipConnection.remoteAudio.srcObject = null;
    }
    if (SipConnection.localAudio.srcObject) {
      SipConnection.localAudio.srcObject = null;
    }

    await this.registerer?.unregister().catch(() => {});
    await this.userAgent?.stop().catch(() => {});
    this.userAgent = null;
    this.registerer = null;
  }
}
