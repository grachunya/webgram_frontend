import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { AgentStatus } from "./statusConstants";
import { STATUS_OPTIONS } from "./statusConstants";
import styles from "./StatusSelect.module.scss";

const STATUS_CONFIG: Record<
  AgentStatus,
  { label: string; dotClass: string; triggerClass: string }
> = {
  Available: {
    label: "На линии",
    dotClass: styles.dotOnline,
    triggerClass: styles.triggerOnline,
  },
  "Logged Out": {
    label: "Отсутствует",
    dotClass: styles.dotOffline,
    triggerClass: styles.triggerOffline,
  },
};

interface StatusSelectProps {
  value: AgentStatus | "";
  onChange: (status: AgentStatus) => void;
  disabled?: boolean;
  placeholder?: string;
  compact?: boolean;
}

const StatusSelect = ({
  value,
  onChange,
  disabled,
  placeholder,
  compact,
}: StatusSelectProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = value ? STATUS_CONFIG[value] : null;

  return (
    <div
      className={`${styles.picker} ${compact ? styles.compact : ""}`}
      ref={ref}
    >
      <button
        type="button"
        className={`${styles.trigger} ${current?.triggerClass ?? ""} ${open ? styles.triggerOpen : ""}`}
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
      >
        <div className={styles.dotLabel}>
          <span
            className={`${styles.dot} ${current?.dotClass ?? styles.dotOffline}`}
          />
          <span className={styles.label}>
            {current?.label ?? placeholder ?? "Не задан"}
          </span>
        </div>

        <ChevronDown size={14} className={open ? styles.chevronUp : ""} />
      </button>

      {open && !disabled && (
        <div className={styles.dropdown}>
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              className={styles.option}
              onClick={() => {
                onChange(s);
                setOpen(false);
              }}
            >
              <span className={`${styles.dot} ${STATUS_CONFIG[s].dotClass}`} />
              {STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusSelect;
