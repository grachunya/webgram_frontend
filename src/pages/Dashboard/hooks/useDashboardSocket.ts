import { useEffect, useRef, useState } from "react";

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
const FLUSH_MS = 1000;

export const useDashboardSocket = (): DashboardData => {
  const [resources, setResources] = useState<SystemResources | null>(null);
  const [callsCount, setCallsCount] = useState<number | null>(null);
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("connecting");

  const resourcesRef = useRef<SystemResources | null>(null);
  const callsCountRef = useRef<number | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setResources(resourcesRef.current);
      setCallsCount(callsCountRef.current);
    }, FLUSH_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let isUnmounted = false;
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => setConnectionState("connected");
    ws.onmessage = (event: MessageEvent) => {
      const parsed = JSON.parse(event.data);
      if (parsed.type === "SYSTEM_RESOURCES_MONITORING" && parsed.data) {
        resourcesRef.current = parsed.data;
      }
      if (parsed.type === "CALL_COUNT" && parsed.data) {
        callsCountRef.current = parsed.data.calls_count;
      }
    };
    ws.onerror = () => setConnectionState("error");
    ws.onclose = () => {
      if (!isUnmounted) setConnectionState("error");
    };

    return () => {
      isUnmounted = true;
      ws.close();
    };
  }, []);

  return { resources, callsCount, connectionState };
};
