import { useAppDispatch } from "@/store/hooks";
import { fetchCurrentUser } from "@/store/slices/userSlice";
import type { AgentStatus } from "@api/agents";
import { setStatus as setStatusApi } from "@api/agents";
import { useAuth } from "@hooks/useAuth";
import { useCall } from "@hooks/useCall";
import { useCurrentUser } from "@hooks/useCurrentUser";
import Button from "@ui/Button/Button";
import StatusSelect from "@ui/StatusSelect/StatusSelect";
import { LogOut, Phone, PhoneCall, PhoneOff } from "lucide-react";
import styles from "./Header.module.scss";

const Header = () => {
  const { logout } = useAuth();
  const { data: user } = useCurrentUser();
  const dispatch = useAppDispatch();

  const {
    phone,
    error,
    callStatus,
    timer,
    inCall,
    isActive,
    handlePhoneChange,
    handleCall,
    handleHangup,
  } = useCall();

  const agentStatus = (user?.agent?.agent_status || "") as AgentStatus | "";

  const handleStatusChange = async (status: AgentStatus) => {
    if (!user?.agent) return;

    try {
      await setStatusApi({
        agent_uuid: user.agent.agent_uuid,
        agent_status: status,
      });

      dispatch(fetchCurrentUser());
    } catch (error) {
      console.error("Ошибка смены статуса:", error);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <PhoneCall size={22} />
        <span>Вебграм</span>
      </div>

      <div className={styles.statusSelect}>
        <StatusSelect
          value={agentStatus}
          onChange={handleStatusChange}
          disabled={!user?.agent}
          placeholder="Не задан"
          compact
        />
      </div>

      <div className={styles.callGroup}>
        <input
          className={styles.phoneInput}
          type="tel"
          placeholder="Номер телефона"
          value={phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          disabled={inCall}
        />

        {inCall ? (
          <Button className={styles.btnHangup} onClick={handleHangup}>
            <PhoneOff size={16} />
            <span>{isActive && timer ? timer : callStatus}</span>
          </Button>
        ) : (
          <Button
            className={styles.btnCall}
            onClick={handleCall}
            disabled={!phone.trim()}
          >
            <Phone size={16} />
            <span>Позвонить</span>
          </Button>
        )}

        {error && <span className={styles.callError}>{error}</span>}
      </div>

      <button
        className={styles.logoutBtn}
        onClick={() => logout()}
        title="Выйти"
      >
        <LogOut size={18} />
      </button>
    </header>
  );
};

export default Header;
