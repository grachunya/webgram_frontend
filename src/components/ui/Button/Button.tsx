import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'ghost';
  block?: boolean;
}

const Button = ({
  variant = 'primary',
  block,
  className,
  ...rest
}: ButtonProps) => (
  <button
    className={`${styles.button} ${styles[variant]} ${block ? styles.block : ''} ${className ?? ''}`}
    {...rest}
  />
);

export default Button;
