// src/components/CategorySelect.tsx
import { useCategories } from "../hooks/useCategories";
import styles from "./CategorySelect.module.scss";

type Props = {
  value: number;
  onChange: (id: number) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
  allowDelete?: boolean; // show inline delete button for selected item
};

export default function CategorySelect({
  value,
  onChange,
  disabled,
  className,
  id,
  name,
  allowDelete = true,
}: Props) {
  const { list, remove } = useCategories();

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

  // Delete the currently selected category
  const handleDelete = () => {
    if (!value) 
      return;

    if (!window.confirm("Remove the Category permanently?")) return;

    // fallback selection before removing the current one
    const nextId = (list.data ?? []).find(c => c.id !== value)?.id;

    remove.mutate(value, {
      onSuccess: () => {
        // Pick the next available category if possible
        if (nextId != null) onChange(nextId);
      },
    });
  };

  return (
    <div className={styles.group}>
      <select
        id={id}
        name={name}
        className={[className, styles.select].filter(Boolean).join(" ")} /* keep parent style */
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
      >
        {list.data!.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      {allowDelete && (
        <button
          type="button"
          className={styles.deleteBtn}
          onClick={handleDelete}
          aria-label="Category delete"
          title="Category delete"
          disabled={disabled || remove.isPending}
        >
          ×
        </button>
      )}
    </div>
  );
}
