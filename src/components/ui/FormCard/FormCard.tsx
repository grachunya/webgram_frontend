import type { ReactNode } from 'react';
import styles from './FormCard.module.scss';

interface FormCardProps {
  title?: string;
  children: ReactNode;
}

const FormCard = ({ title, children }: FormCardProps) => (
  <div className={styles.page}>
    <div className={styles.card}>
      {title && <h1 className={styles.title}>{title}</h1>}
      {children}
    </div>
  </div>
);

export default FormCard;
