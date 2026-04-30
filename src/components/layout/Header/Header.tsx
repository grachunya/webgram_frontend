import type { AgentStatus } from "@api/agents";
import { setStatus as setStatusApi } from "@api/agents";
import { useAuth } from "@hooks/useAuth";
import { useCall } from "@hooks/useCall";
import { useCurrentUser } from "@hooks/useCurrentUser";
import { useOperatorPanel } from "@services/operatorPanel/useOperatorPanel";
import Button from "@ui/Button/Button";
import StatusSelect from "@ui/StatusSelect/StatusSelect";
import { ArrowRightLeft, LogOut, Phone, PhoneCall, PhoneOff } from "lucide-react";
import { useMemo } from "react";
import styles from "./Header.module.scss";

const Header = () => {
  const { logout } = useAuth();
  const { data: user } = useCurrentUser();
  const { lastMessage } = useOperatorPanel();

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
    transferOpen,
    transferTarget,
    transferError,
    handleTransferToggle,
    handleTransferTargetChange,
    handleTransfer,
  } = useCall();

  const agentStatus = useMemo(() => {
    const base = (user?.agent?.agent_status || "") as AgentStatus | "";
    if (
      lastMessage?.type === "AGENT_DATA" &&
      lastMessage.data.agent_uuid === user?.agent?.agent_uuid
    ) {
      return lastMessage.data.agent_status as AgentStatus | "";
    }
    return base;
  }, [user?.agent?.agent_status, user?.agent?.agent_uuid, lastMessage]);

  const handleStatusChange = async (status: AgentStatus) => {
    if (!user?.agent) return;

    try {
      await setStatusApi({
        agent_uuid: user.agent.agent_uuid,
        agent_status: status,
      });
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
          <>
            <Button className={styles.btnHangup} onClick={handleHangup}>
              <PhoneOff size={16} />
              <span>{isActive && timer ? timer : callStatus}</span>
            </Button>
            {isActive && (
              <div className={styles.transferWrapper}>
                <Button
                  className={styles.btnTransfer}
                  onClick={handleTransferToggle}
                >
                  <ArrowRightLeft size={16} />
                </Button>
                {transferOpen && (
                  <div className={styles.transferDropdown}>
                    <input
                      className={styles.transferInput}
                      type="tel"
                      placeholder="Номер для перевода"
                      value={transferTarget}
                      onChange={(e) => handleTransferTargetChange(e.target.value)}
                    />
                    <Button
                      className={styles.btnTransferConfirm}
                      onClick={handleTransfer}
                      disabled={!transferTarget.trim()}
                    >
                      <ArrowRightLeft size={14} />
                    </Button>
                    {transferError && (
                      <span className={styles.transferError}>{transferError}</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
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
