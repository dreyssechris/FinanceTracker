// src/components/CategorySelect.tsx
import { useCategories } from "../hooks/useCategories";
import styles from "./CategorySelect.module.scss";

type Props = {
  value: number;
  onChange: (id: number) => void;
  disabled?: boolean;
  className?: string; // allow parent styling (same as Type-select)
  id?: string;
  name?: string;
};

export default function CategorySelect({ value, onChange, disabled, className, id, name }: Props) {
  const { list } = useCategories();

  if (list.isLoading) {
    return (
      <select id={id} name={name} className={className} disabled>
        <option>Loading…</option>
      </select>
    );
  }

  if (list.isError) {
    return <div className={styles.error}>Failed to load categories</div>;
  }

  return (
    <select
      id={id}
      name={name}
      className={className}                     /* same look as Type-select */
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      disabled={disabled}
    >
      {list.data!.map((c) => (
        <option key={c.id} value={c.id}>{c.name}</option>
      ))}
    </select>
  );
}
