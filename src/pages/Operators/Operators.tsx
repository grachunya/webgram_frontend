import { useOperators } from './hooks/useOperators';
import OperatorsTable from './components/OperatorsTable/OperatorsTable';
import { getServerErrorMessage } from '@lib/getErrorMessage';
import styles from './Operators.module.scss';

const Operators = () => {
  const data = useOperators();

  if (data.isPending) return <p className={styles.loading}>Загрузка…</p>;
  if (data.isError)
    return (
      <p className={styles.error}>
        {getServerErrorMessage(data.error) ?? 'Ошибка загрузки операторов'}
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
