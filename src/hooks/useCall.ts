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
  };
};
