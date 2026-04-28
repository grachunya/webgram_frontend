import { useContext } from "react";
import { SipContext, type SipContextValue } from "@services/sip/sipContext";

export const useSip = (): SipContextValue => {
  const ctx = useContext(SipContext);
  if (!ctx) {
    throw new Error("useSip must be used inside <SipProvider>");
  }
  return ctx;
};
