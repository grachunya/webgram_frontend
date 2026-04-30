import { useCallback, useEffect, useState } from "react";

export interface SystemResources {
  ram: { total_gb: number; used_gb: number; free_gb: number };
  disk: { total_gb: number; used_gb: number; free_gb: number };
  cpu: { cpu_usage_percent: number; cpu_free_percent: number };
}

export type ConnectionState = "connecting" | "connected" | "error";

interface DashboardData {
  resources: SystemResources | null;
  callsCount: number | null;
  connectionState: ConnectionState;
}

const WS_URL = "wss://xn--80abcfi9b0a.xn--p1ai/backend/dashboard";

export const useDashboardSocket = (): DashboardData => {
  const [resources, setResources] = useState<SystemResources | null>(null);
  const [callsCount, setCallsCount] = useState<number | null>(null);
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("connecting");

  const handleMessage = useCallback((event: MessageEvent) => {
    const parsed = JSON.parse(event.data);

    if (parsed.type === "SYSTEM_RESOURCES_MONITORING" && parsed.data) {
      setResources(parsed.data);
    }

    if (parsed.type === "CALL_COUNT" && parsed.data) {
      setCallsCount(parsed.data.calls_count);
    }
  }, []);

  useEffect(() => {
    let isUnmounted = false;

    const ws = new WebSocket(WS_URL);

    ws.onopen = () => setConnectionState("connected");
    ws.onmessage = handleMessage;
    ws.onerror = () => setConnectionState("error");
    ws.onclose = () => {
      if (!isUnmounted) setConnectionState("error");
    };

    return () => {
      isUnmounted = true;
      ws.close();
    };
  }, [handleMessage]);

  return { resources, callsCount, connectionState };
};
