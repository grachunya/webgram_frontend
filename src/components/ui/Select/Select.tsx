import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './Select.module.scss';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  options: SelectOption[];
  value: string;
  error?: string;
  onChange: (value: string) => void;
  name?: string;
  placeholder?: string;
}

const Select = ({
  label,
  options,
  value,
  error,
  onChange,
  name,
  placeholder = 'Выберите...',
}: SelectProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false);
  };

  return (
    <div className={styles.field} ref={ref}>
      <label className={styles.label}>{label}</label>

      <button
        type="button"
        name={name}
        className={`${styles.trigger} ${open ? styles.open : ''} ${error ? styles.hasError : ''}`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={selected ? styles.selectedText : styles.placeholder}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`${styles.chevron} ${open ? styles.chevronUp : ''}`}
        />
      </button>

      {open && (
        <div className={styles.dropdown}>
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`${styles.option} ${opt.value === value ? styles.optionActive : ''}`}
              onClick={() => handleSelect(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};

export default Select;
