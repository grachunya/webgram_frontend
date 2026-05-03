import { createContext } from "react";
import type { OperatorPanelMessage, UpdateCallsPayload } from "./OperatorPanelProvider";

export interface OperatorPanelState {
  status: "connecting" | "open" | "closed";
  error: string | null;
  lastMessage: OperatorPanelMessage | null;
  calls: UpdateCallsPayload;
}

export const OperatorPanelContext = createContext<OperatorPanelState>({
  status: "closed",
  error: null,
  lastMessage: null,
  calls: {},
});
