import { useEffect, useMemo, useRef, useState } from "react";
import { SipClient, type Config } from "./SipClient";
import { SipContext, type SipContextValue } from "./sipContext";
import type { SipStatus, CallStatus, SipCallbacks } from "./types";
import type { User } from "@api/users";

interface SipProviderProps {
  user: User;
  children: React.ReactNode;
}

const SIP_CONFIG: Omit<Config, "username" | "password"> = {
  domain: "72.56.35.81",
  wsServer: "wss://xn--80abcfi9b0a.xn--p1ai:7443",
};

export default function SipProvider({ user, children }: SipProviderProps) {
  const mountedRef = useRef(true);
  const initRef = useRef(false);
  const clientRef = useRef<SipClient | null>(null);

  const [sipStatus, setSipStatus] = useState<SipStatus>("Не подключен");
  const [callStatus, setCallStatus] = useState<CallStatus | null>(null);
  const [caller, setCaller] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<SipClient | null>(null);

  const config = useMemo((): Config | null => {
    const { agent } = user;
    if (!agent?.agent_number || !agent?.agent_password) return null;
    return {
      username: agent.agent_number,
      password: agent.agent_password,
      ...SIP_CONFIG,
    };
  }, [user]);

  useEffect(() => {
    mountedRef.current = true;

    if (!config || initRef.current) return;
    initRef.current = true;

    const id = setTimeout(() => {
      if (!mountedRef.current) return;

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
          err instanceof Error
            ? err.message
            : "Не удалось подключиться к SIP",
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
  }, [config]);

  const value = useMemo<SipContextValue>(
    () => ({ sipStatus, callStatus, caller, error, client }),
    [sipStatus, callStatus, caller, error, client],
  );

  return <SipContext.Provider value={value}>{children}</SipContext.Provider>;
}
