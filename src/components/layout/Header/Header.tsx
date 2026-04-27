import { useState } from "react";
import { Phone, PhoneCall, LogOut } from "lucide-react";
import Button from "@ui/Button/Button";
import StatusSelect from "@ui/StatusSelect/StatusSelect";
import type { AgentStatus } from "@api/agents";
import { useAuth } from "@hooks/useAuth";
import { useCurrentUser } from "@hooks/useCurrentUser";
import { useQueryClient } from "@tanstack/react-query";
import { setStatus as setStatusApi } from "@api/agents";
import styles from "./Header.module.scss";

const Header = () => {
  const { logout } = useAuth();
  const { data: user } = useCurrentUser();
  const qc = useQueryClient();
  const [phone, setPhone] = useState("");

  const agentStatus = (user?.agent?.agent_status || "") as AgentStatus | "";

  const handleStatusChange = async (status: AgentStatus) => {
    if (!user?.agent) return;
    try {
      await setStatusApi({
        agent_uuid: user.agent.agent_uuid,
        agent_status: status,
      });
      qc.invalidateQueries({ queryKey: ["currentUser"] });
      qc.invalidateQueries({ queryKey: ["users"] });
    } catch {
      // ignore
    }
  };

  const handleCall = () => {
    if (!phone.trim()) return;
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <PhoneCall size={22} />
        <span>Webgram</span>
      </div>

      <StatusSelect
        value={agentStatus}
        onChange={handleStatusChange}
        disabled={!user?.agent}
        placeholder="Не задан"
      />

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
