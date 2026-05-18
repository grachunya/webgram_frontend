import { Volume2 } from "lucide-react";
import { useState } from "react";
import { useCallRecord } from "../../hooks/useCallRecord";
import styles from "./AudioPlayer.module.scss";

export const AudioPlayer = ({ callUuid }: { callUuid: string }) => {
  const [hasInteracted, setHasInteracted] = useState(false);
  const { recordUrl, isPending, isError } = useCallRecord(
    hasInteracted ? callUuid : null,
  );

  if (isError) {
    return <div className={styles.error}>Запись не найдена</div>;
  }

  if (!hasInteracted) {
    return (
      <div
        className={styles.placeholder}
        onClick={() => setHasInteracted(true)}
        title="Нажмите чтобы прослушать аудио"
      >
        <Volume2 size={20} className={styles.placeholderIcon} />
        <span className={styles.placeholderText}>
          Нажмите для прослушивания
        </span>
      </div>
    );
  }

  if (isPending) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <div className={styles.container}>
      <audio
        controls
        className={styles.nativePlayer}
        src={recordUrl}
        preload="metadata"
      >
        Ваш браузер не поддерживает аудио.
      </audio>
    </div>
  );
};
