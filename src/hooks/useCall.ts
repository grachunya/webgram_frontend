import { useCallback, useEffect, useRef, useState } from "react";
import { useSip } from "./useSip";

const ALLOWED = /^[0-9+*#]+$/;
const TICK = 1000;

const formatTimer = (seconds: number): string => {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
};

export const useCall = () => {
  const { client, callStatus } = useSip();

  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [timerDisplay, setTimerDisplay] = useState<string | null>(null);

  const [transferTarget, setTransferTarget] = useState("");
  const [transferOpen, setTransferOpen] = useState(false);
  const [transferError, setTransferError] = useState<string | null>(null);

  const secondsRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isActive = callStatus === "Разговор";
  const inCall =
    callStatus === "Набор..." ||
    callStatus === "Входящий вызов" ||
    callStatus === "Разговор";

  useEffect(() => {
    const id = setTimeout(() => {
      if (isActive && !timerRef.current) {
        secondsRef.current = 0;
        setTimerDisplay(formatTimer(0));
        timerRef.current = setInterval(() => {
          secondsRef.current += 1;
          setTimerDisplay(formatTimer(secondsRef.current));
        }, TICK);
      }

      if (!isActive && timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        secondsRef.current = 0;
        setTimerDisplay(null);
      }
    }, 0);

    return () => {
      clearTimeout(id);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isActive]);

  const prevInCallRef = useRef(inCall);
  useEffect(() => {
    if (prevInCallRef.current && !inCall) {
      const id = setTimeout(() => {
        setTransferTarget("");
        setTransferOpen(false);
        setTransferError(null);
      }, 0);
      return () => clearTimeout(id);
    }
    prevInCallRef.current = inCall;
  }, [inCall]);

  const handlePhoneChange = useCallback((value: string) => {
    setError(null);
    if (value === "" || ALLOWED.test(value)) {
      setPhone(value);
    }
  }, []);

  const handleCall = useCallback(async () => {
    const target = phone.trim();
    if (!target) {
      setError("Введите номер");
      return;
    }
    if (!client) {
      setError("SIP не подключен");
      return;
    }
    setError(null);
    try {
      await client.makeCall(target);
    } catch {
      setError("Не удалось позвонить");
    }
  }, [phone, client]);

  const handleHangup = useCallback(async () => {
    await client?.endCall();
  }, [client]);

  const handleTransferTargetChange = useCallback((value: string) => {
    setTransferError(null);
    if (value === "" || ALLOWED.test(value)) {
      setTransferTarget(value);
    }
  }, []);

  const handleTransfer = useCallback(async () => {
    const target = transferTarget.trim();
    if (!target) {
      setTransferError("Введите номер");
      return;
    }
    if (!client) {
      setTransferError("SIP не подключен");
      return;
    }
    try {
      await client.transfer(target);
      setTransferOpen(false);
      setTransferTarget("");
      setTransferError(null);
    } catch {
      setTransferError("Не удалось перевести");
    }
  }, [transferTarget, client]);

  return {
    phone,
    error,
    callStatus,
    timer: timerDisplay,
    inCall,
    isActive,
    handlePhoneChange,
    handleCall,
    handleHangup,
    transferOpen,
    transferTarget,
    transferError,
    handleTransferToggle: useCallback(() => setTransferOpen((v) => !v), []),
    handleTransferTargetChange,
    handleTransfer,
  };
};
