import { createContext } from "react";
import type { OperatorPanelMessage } from "./OperatorPanelProvider";

interface OperatorPanelState {
  status: "connecting" | "open" | "closed";
  error: string | null;
  lastMessage: OperatorPanelMessage | null;
}

export const OperatorPanelContext = createContext<OperatorPanelState>({
  status: "closed",
  error: null,
  lastMessage: null,
});
