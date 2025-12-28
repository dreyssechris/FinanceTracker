import { useState } from "react";
import { useCategories } from "../hooks/useCategories";
import styles from "./CategoryCreate.module.scss";

type Props = { 
  onCreated?: (id: number) => void;
  className?: string 
};

export default function CategoryCreate({ 
    onCreated, 
    className 
}: Props) {
  const { list, create } = useCategories();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function add() {
    setError(null);
    const trimmed = name.trim();
    if (!trimmed) 
      return;

    const exists = (list.data ?? []).some(
      c => c.name.trim().toLowerCase() === trimmed.toLowerCase()
    );
    
    if (exists) { 
      setError("Category already exists.");
      return; 
    }

    try {
      const created = (await create.mutateAsync(trimmed)); 

      if (created && typeof (created as any).id === "number" && onCreated) {
        onCreated((created as any).id);
        setName("");
      }
    } catch (err: any) {
        setError(err?.message || "Failed to create category.");
    }
  }

  // avoid outer form submit
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
       e.preventDefault(); 
       void add();
    }
  };

  return (
    <div className={[styles.row, className].filter(Boolean).join(" ")}>
      {/* input group with button inside the field */}
      <div className={styles.inputGroup}>
        <input
          className={styles.input}
          placeholder="New Category"
          value={name}
          onChange={(e) => { 
            setError(null); setName(e.target.value);
          }}
          onKeyDown={onKeyDown}
          disabled={create.isPending}
        />
        <button
          type="button"
          className={styles.btnInside}
          onClick={add}
          disabled={!name.trim() || create.isPending}
        >
          Create
        </button>
      </div>

      {error && <div className={styles.error} role="alert">{error}</div>}
    </div>
  );
}
