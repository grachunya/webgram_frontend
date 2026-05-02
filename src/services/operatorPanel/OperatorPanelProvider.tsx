import { useAppSelector } from "@/store/hooks";
import { useEffect, useRef, useState } from "react";
import { OperatorPanelContext } from "./OperatorPanelContext";

const WS_BASE = "wss://xn--80abcfi9b0a.xn--p1ai/backend/operator-panel";

export interface AgentDataPayload {
  agent_uuid: string;
  agent_name: string;
  agent_number: string;
  agent_password: string;
  domain_uuid: string;
  agent_status: string;
  user_uuid: string;
}

export interface OperatorPanelMessage {
  type: "AGENT_DATA";
  data: AgentDataPayload;
}

interface OperatorPanelState {
  status: "connecting" | "open" | "closed";
  error: string | null;
  lastMessage: OperatorPanelMessage | null;
}

export default function OperatorPanelProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const agentUuid = useAppSelector(
    (s) => s.user.currentUser?.agent?.agent_uuid ?? null,
  );
  const connectedUuidRef = useRef<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const [state, setState] = useState<OperatorPanelState>({
    status: "closed",
    error: null,
    lastMessage: null,
  });

  useEffect(() => {
    if (!agentUuid) {
      wsRef.current?.close();
      wsRef.current = null;
      connectedUuidRef.current = null;
      return;
    }

    if (connectedUuidRef.current === agentUuid) return;

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    connectedUuidRef.current = agentUuid;

    const ws = new WebSocket(`${WS_BASE}/${agentUuid}`);
    wsRef.current = ws;

    ws.onopen = () => setState((s) => ({ ...s, status: "open", error: null }));
    ws.onclose = () => {
      connectedUuidRef.current = null;
      if (wsRef.current === ws) wsRef.current = null;
      setState((s) => ({ ...s, status: "closed" }));
    };
    ws.onerror = () =>
      setState((s) => ({ ...s, error: "WebSocket connection error" }));
    ws.onmessage = (e: MessageEvent<string>) => {
      const parsed: unknown = JSON.parse(e.data);
      if (typeof parsed === "object" && parsed !== null && "type" in parsed) {
        const msg = parsed as OperatorPanelMessage;
        setState((s) => {
          const prev = s.lastMessage?.data;
          const next = msg.data;
          if (
            prev &&
            prev.agent_uuid === next.agent_uuid &&
            prev.agent_status === next.agent_status
          ) {
            return s;
          }
          return { ...s, lastMessage: msg };
        });
      }
    };

    return () => {
      ws.close();
      if (wsRef.current === ws) wsRef.current = null;
      connectedUuidRef.current = null;
    };
  }, [agentUuid]);

  return (
    <OperatorPanelContext.Provider value={state}>
      {children}
    </OperatorPanelContext.Provider>
  );
}
