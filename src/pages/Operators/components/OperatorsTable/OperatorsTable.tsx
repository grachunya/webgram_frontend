import type { AgentStatus, FreeAgent, Queue } from "@api/agents";
import type { User } from "@api/users";
import RoleBadge from "@ui/RoleBadge/RoleBadge";
import Select from "@ui/Select/Select";
import StatusSelect from "@ui/StatusSelect/StatusSelect";
import { useState } from "react";
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
                      value={agent.agent_status as AgentStatus}
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
                  Не в разговоре
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
