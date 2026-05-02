import {
  endCall,
  spyAgent,
  type AgentStatus,
  type FreeAgent,
  type Queue,
} from "@api/agents";
import type { User } from "@api/users";
import { useCurrentUser } from "@hooks/useCurrentUser";
import { useOperatorPanel } from "@services/operatorPanel/useOperatorPanel";
import RoleBadge from "@ui/RoleBadge/RoleBadge";
import Select from "@ui/Select/Select";
import StatusSelect from "@ui/StatusSelect/StatusSelect";
import { Mic, PhoneOff } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import styles from "./OperatorsTable.module.scss";
import QueuePicker from "./QueuePicker/QueuePicker";

interface OperatorsTableProps {
  users: User[];
  freeAgents: FreeAgent[];
  queues: Queue[];
  onAssignAgent: (data: { agentUuid: string; userUuid: string }) => void;
  onSetStatus: (data: {
    agent_uuid: string;
    agent_status: AgentStatus;
  }) => void;
  onSetQueues: (data: { agent_uuid: string; queue_uuids: string[] }) => void;
}

const OperatorsTable = ({
  users,
  freeAgents,
  queues,
  onAssignAgent,
  onSetStatus,
  onSetQueues,
}: OperatorsTableProps) => {
  const [queueSelections, setQueueSelections] = useState<
    Record<string, string[]>
  >({});
  const { lastMessage, calls } = useOperatorPanel();
  const { data: me } = useCurrentUser();

  const handleEndCall = useCallback((callUuid: string) => {
    endCall(callUuid).catch(() => {});
  }, []);

  const handleSpy = useCallback(
    (callUuid: string, victimNumber: string) => {
      if (!me?.agent) return;
      spyAgent({
        call_uuid: callUuid,
        victim_agent_number: victimNumber,
        spy_agent_number: me.agent.agent_number ?? "",
        domain_uuid: me.agent.domain.domain_uuid,
      }).catch(() => {});
    },
    [me],
  );

  const liveStatus = useMemo(() => {
    if (lastMessage?.type === "AGENT_DATA") {
      return {
        uuid: lastMessage.data.agent_uuid,
        status: lastMessage.data.agent_status,
      };
    }
    return null;
  }, [lastMessage]);

  const agentOptions = freeAgents.map((a) => ({
    value: a.agent_uuid,
    label: a.agent_number || a.agent_name,
  }));

  const agentOptionsWithCurrent = (agent: NonNullable<User["agent"]>) => {
    const current = {
      value: agent.agent_uuid,
      label: agent.agent_number || agent.agent_name,
    };
    return [
      current,
      ...agentOptions.filter((a) => a.value !== agent.agent_uuid),
    ];
  };

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Имя</th>
            <th>Номер</th>
            <th>Очереди</th>
            <th>Статус</th>
            <th>Статус разговоров</th>
            <th>Роль</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const agent = user.agent;

            return (
              <tr key={user.user_uuid}>
                <td className={styles.nameCell}>{user.user_name}</td>

                <td className={styles.selectCell}>
                  <Select
                    label=""
                    options={
                      agent ? agentOptionsWithCurrent(agent) : agentOptions
                    }
                    value={agent?.agent_uuid ?? ""}
                    placeholder="Назначить..."
                    onChange={(uuid) =>
                      onAssignAgent({
                        agentUuid: uuid,
                        userUuid: user.user_uuid,
                      })
                    }
                  />
                </td>

                <td className={styles.queueCell}>
                  {agent ? (
                    <QueuePicker
                      queues={queues}
                      selected={
                        queueSelections[agent.agent_uuid] ??
                        agent.queues.map((q) => q.queue_uuid)
                      }
                      onChange={(uuids) => {
                        setQueueSelections((prev) => ({
                          ...prev,
                          [agent.agent_uuid]: uuids,
                        }));
                        onSetQueues({
                          agent_uuid: agent.agent_uuid,
                          queue_uuids: uuids,
                        });
                      }}
                    />
                  ) : (
                    <span className={styles.muted}>Не назначено</span>
                  )}
                </td>

                <td className={styles.selectCell}>
                  {agent ? (
                    <StatusSelect
                      value={
                        (liveStatus?.uuid === agent.agent_uuid
                          ? liveStatus.status
                          : agent.agent_status) as AgentStatus
                      }
                      onChange={(s) =>
                        onSetStatus({
                          agent_uuid: agent.agent_uuid,
                          agent_status: s,
                        })
                      }
                    />
                  ) : (
                    <span className={styles.muted}>Не назначен</span>
                  )}
                </td>
                <td className={`${styles.queueCell} ${styles.statusCall}`}>
                  {agent ? (
                    (() => {
                      const agentCalls = calls[agent.agent_uuid];
                      const call = agentCalls?.[0];
                      if (!call) {
                        return <span className={styles.muted}>Нет звонка</span>;
                      }
                      return (
                        <div className={styles.callBlock}>
                          <span
                            className={
                              call.direction === "inbound"
                                ? styles.inbound
                                : styles.outbound
                            }
                          >
                            {call.direction === "inbound"
                              ? "Входящий"
                              : "Исходящий"}
                          </span>
                          <div className={styles.callActions}>
                            <button
                              className={`${styles.callBtn} ${styles.spyBtn}`}
                              title="Прослушать"
                              onClick={() =>
                                handleSpy(
                                  call.call_uuid,
                                  agent.agent_number ?? "",
                                )
                              }
                            >
                              <Mic size={14} />
                            </button>
                            <button
                              className={`${styles.callBtn} ${styles.endBtn}`}
                              title="Сбросить"
                              onClick={() => handleEndCall(call.call_uuid)}
                            >
                              <PhoneOff size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <span className={styles.muted}>—</span>
                  )}
                </td>
                <td>
                  <RoleBadge roleName={user.role.role_name} />
                </td>
              </tr>
            );
          })}
          {users.length === 0 && (
            <tr>
              <td colSpan={5} className={styles.empty}>
                Нет пользователей
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OperatorsTable;
