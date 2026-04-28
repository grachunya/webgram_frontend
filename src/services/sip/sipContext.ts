import { createContext } from "react";
import type { SipClient } from "./SipClient";
import type { SipStatus, CallStatus } from "./types";

export interface SipContextValue {
  sipStatus: SipStatus;
  callStatus: CallStatus | null;
  caller: string | null;
  error: string | null;
  client: SipClient | null;
}

export const SipContext = createContext<SipContextValue | null>(null);
