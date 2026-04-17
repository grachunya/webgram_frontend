import { useState } from "react";

interface ConfirmState {
  title: string;
  message: string;
  onConfirm: () => void;
}

export const useConfirm = () => {
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);

  const requestConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirm({ title, message, onConfirm });
  };

  const handleConfirm = () => {
    confirm?.onConfirm();
    setConfirm(null);
  };

  const cancelConfirm = () => setConfirm(null);

  return { confirm, requestConfirm, handleConfirm, cancelConfirm };
};
