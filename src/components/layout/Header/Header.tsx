import { useState, useRef, useEffect } from "react";
import { Phone, PhoneCall, ChevronDown, LogOut } from "lucide-react";
import Button from "@ui/Button/Button";
import { useAuth } from "@hooks/useAuth";
import styles from "./Header.module.scss";

type Status = "offline" | "break" | "online";

const STATUS_MAP: Record<Status, { label: string; colorVar: string }> = {
  offline: { label: "Отсутствует", colorVar: styles.dotOffline },
  break: { label: "На перерыве", colorVar: styles.dotBreak },
  online: { label: "На линии", colorVar: styles.dotOnline },
};

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: "offline", label: "Отсутствует" },
  { value: "break", label: "На перерыве" },
  { value: "online", label: "На линии" },
];

const Header = () => {
  const { logout } = useAuth();
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<Status>("offline");
  const [statusOpen, setStatusOpen] = useState(false);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setStatusOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = STATUS_MAP[status];

  const handleCall = () => {
    if (!phone.trim()) return;
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <PhoneCall size={22} />
        <span>Webgram</span>
      </div>

      <div className={styles.statusSelect} ref={statusRef}>
        <button
          type="button"
          className={`${styles.statusTrigger} ${statusOpen ? styles.triggerOpen : ""}`}
          onClick={() => setStatusOpen((v) => !v)}
          data-status={status}
        >
          <span className={`${styles.dot} ${current.colorVar}`} />
          <span className={styles.statusLabel}>{current.label}</span>
          <ChevronDown
            size={14}
            className={statusOpen ? styles.chevronUp : ""}
          />
        </button>

        {statusOpen && (
          <div className={styles.statusDropdown}>
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`${styles.statusOption} ${opt.value === status ? styles.statusOptionActive : ""}`}
                onClick={() => {
                  setStatus(opt.value);
                  setStatusOpen(false);
                }}
              >
                <span
                  className={`${styles.dot} ${STATUS_MAP[opt.value].colorVar}`}
                />
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles.callGroup}>
        <input
          className={styles.phoneInput}
          type="tel"
          placeholder="Номер телефона"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Button className={styles.btnCall} onClick={handleCall} disabled={!phone.trim()}>
          <Phone size={16} />
          <span>Позвонить</span>
        </Button>
      </div>

      <button className={styles.logoutBtn} onClick={() => logout()} title="Выйти">
        <LogOut size={18} />
      </button>
    </header>
  );
};

export default Header;
