import { useAppSelector } from "@/store/hooks";
import type { User } from "@api/users";
import { useEffect, useMemo, useRef, useState } from "react";
import { SipClient, type Config } from "./SipClient";
import { SipContext, type SipContextValue } from "./sipContext";
import type { CallStatus, SipCallbacks, SipStatus } from "./types";

interface SipProviderProps {
  user: User;
  children: React.ReactNode;
}

const SIP_CONFIG: Omit<Config, "username" | "password" | "domain"> = {
  wsServer: "wss://xn--80abcfi9b0a.xn--p1ai/sip-socket",
};

export default function SipProvider({ user, children }: SipProviderProps) {
  const domain = useAppSelector(
    (state) => state.user.currentUser?.agent?.domain?.domain_name,
  );

  const mountedRef = useRef(true);
  const initRef = useRef(false);
  const clientRef = useRef<SipClient | null>(null);
  const configRef = useRef<Config | null>(null);

  const [sipStatus, setSipStatus] = useState<SipStatus>("Не подключен");
  const [callStatus, setCallStatus] = useState<CallStatus | null>(null);
  const [caller, setCaller] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<SipClient | null>(null);

  useEffect(() => {
    const { agent } = user;
    if (!agent?.agent_number || !agent?.agent_password || !domain) return;

    const nextConfig: Config = {
      username: agent.agent_number,
      password: agent.agent_password,
      domain,
      ...SIP_CONFIG,
    };

    const prev = configRef.current;
    if (
      prev &&
      prev.username === nextConfig.username &&
      prev.password === nextConfig.password &&
      prev.domain === nextConfig.domain
    ) {
      return;
    }

    configRef.current = nextConfig;
  }, [user, domain]);

  useEffect(() => {
    mountedRef.current = true;

    if (!configRef.current || initRef.current) return;
    initRef.current = true;

    const id = setTimeout(() => {
      if (!mountedRef.current) return;

      const config = configRef.current!;
      const callbacks: SipCallbacks = {
        onStatusChange: (s) => setSipStatus(s),
        onCallStatusChange: (s) => setCallStatus(s),
        onIncomingCall: (c) => setCaller(c),
        onError: (e) => setError(e),
        onCallEnd: () => setCaller(null),
      };

      const sipClient = new SipClient(config, callbacks);
      clientRef.current = sipClient;
      setClient(sipClient);

      sipClient.init().catch((err) => {
        if (!mountedRef.current) return;
        setError(
          err instanceof Error ? err.message : "Не удалось подключиться к SIP",
        );
        setSipStatus("Ошибка");
        clientRef.current = null;
        setClient(null);
        initRef.current = false;
      });
    }, 0);

    return () => {
      clearTimeout(id);
      mountedRef.current = false;
      initRef.current = false;
      clientRef.current?.destroy().catch(() => {});
      clientRef.current = null;
    };
  }, []);

  const value = useMemo<SipContextValue>(
    () => ({ sipStatus, callStatus, caller, error, client }),
    [sipStatus, callStatus, caller, error, client],
  );

  return <SipContext.Provider value={value}>{children}</SipContext.Provider>;
}
