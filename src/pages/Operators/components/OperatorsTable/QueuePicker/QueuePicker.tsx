import type { Queue } from "@api/agents";
import { useEffect, useRef, useState } from "react";
import styles from "./QueuePicker.module.scss";

interface QueuePickerProps {
  queues: Queue[];
  selected: string[];
  onChange: (uuids: string[]) => void;
}

const QueuePicker = ({ queues, selected, onChange }: QueuePickerProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (uuid: string) => {
    onChange(
      selected.includes(uuid)
        ? selected.filter((id) => id !== uuid)
        : [...selected, uuid],
    );
  };

  const labels = queues
    .filter((q) => selected.includes(q.queue_uuid))
    .map((q) => q.queue_name);

  return (
    <div className={styles.picker} ref={ref}>
      <button
        type="button"
        className={`${styles.trigger} ${labels.length === 0 ? styles.placeholder : ""} ${open ? styles.triggerOpen : ""}`}
        onClick={() => setOpen((v) => !v)}
      >
        {labels.length > 0 ? labels.join(", ") : "Не выбрано"}
      </button>
      {open && (
        <div className={styles.dropdown}>
          {queues.map((q) => (
            <button
              key={q.queue_uuid}
              type="button"
              className={`${styles.option} ${selected.includes(q.queue_uuid) ? styles.optionActive : ""}`}
              onClick={() => toggle(q.queue_uuid)}
            >
              <span className={selected.includes(q.queue_uuid) ? styles.checked : styles.unchecked} />
              {q.queue_name}
            </button>
          ))}
          {queues.length === 0 && (
            <span className={styles.empty}>Нет очередей</span>
          )}
        </div>
      )}
    </div>
  );
};

export default QueuePicker;
