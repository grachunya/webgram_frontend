import { upgradeSocket } from "@api/agents";
import { useCurrentUser } from "@hooks/useCurrentUser";
import { getServerErrorMessage } from "@lib/getErrorMessage";
import { useEffect, useRef } from "react";
import OperatorsTable from "./components/OperatorsTable/OperatorsTable";
import { useOperators } from "./hooks/useOperators";
import styles from "./Operators.module.scss";

const Operators = () => {
  const data = useOperators();
  const { data: user } = useCurrentUser();
  const calledRef = useRef(false);

  useEffect(() => {
    const uuid = user?.agent?.agent_uuid;
    if (!uuid || calledRef.current) return;
    calledRef.current = true;
    upgradeSocket(uuid).catch(() => {});
  }, [user?.agent?.agent_uuid]);

  if (data.isPending) return <p className={styles.loading}>Загрузка…</p>;
  if (data.isError)
    return (
      <p className={styles.error}>
        {getServerErrorMessage(data.error) ?? "Ошибка загрузки операторов"}
      </p>
    );

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <h1 className={styles.title}>Операторы</h1>
      </div>

      <OperatorsTable
        users={data.users}
        freeAgents={data.freeAgents}
        queues={data.queues}
        onAssignAgent={data.assignAgent.mutate}
        onSetStatus={data.changeStatus.mutate}
        onSetQueues={data.assignQueues.mutate}
      />
    </div>
  );
};

export default Operators;
