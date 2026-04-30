import { useSip } from "@hooks/useSip";
import Button from "@ui/Button/Button";
import { Phone } from "lucide-react";
import styles from "./IncomingCallOverlay.module.scss";

export const IncomingCallOverlay = () => {
  const { callStatus, caller, client } = useSip();

  const isIncoming = callStatus === "Входящий вызов" && caller !== null;

  if (!isIncoming) return null;

  const handleAnswer = () => {
    client?.answerCall();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.iconCircle}>
          <Phone size={28} />
        </div>
        <h2 className={styles.title}>Входящий вызов</h2>
        <p className={styles.caller}>{caller}</p>
        <Button className={styles.btnAccept} onClick={handleAnswer}>
          <Phone size={16} />
          <span>Принять вызов</span>
        </Button>
      </div>
    </div>
  );
};
