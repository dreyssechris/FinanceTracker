// src/components/TransactionForm.tsx
import { useState, useEffect } from "react";
import CategorySelect from "./CategorySelect";
import styles from "./TransactionForm.module.scss";
import type { TransactionCreate, TransactionType } from "../contracts/transactions";

type Props = {
  // Form submission handler:
  // - Create page: create.mutate(values)
  // - Edit modal:  update.mutate({ id, payload: values })
  onSubmit: (values: TransactionCreate) => void;

  // Prefill values for edit (optional). Keep the shape ergonomic for callers.
  // IMPORTANT: `date` should be "yyyy-MM-dd" if you bind it to <input type="date">
  defaultValues?: Partial<TransactionCreate>;

  // UX helpers:
  submitting?: boolean;      // disable form while mutation is running
  submitLabel?: string;      // "Create" (default) or "Save changes"
  onCancel?: () => void;     // show a "Cancel" button when provided (edit modal)

  // Convenience default if neither defaultValues.categoryId nor state is set
  defaultCategoryId?: number;
};

export default function TransactionForm({
  onSubmit,
  defaultValues,
  submitting = false,
  submitLabel = "Create",
  onCancel,
  defaultCategoryId = 1,
}: Props) {
  // --- Local state mirrors form fields. Initialize from defaultValues (if any) ---
  const [title, setTitle] = useState(defaultValues?.title ?? "");
  const [amount, setAmount] = useState<number>(defaultValues?.amount ?? 0);
  const [type, setType] = useState<TransactionType>(defaultValues?.type ?? "Income");

  // Keep date in "yyyy-MM-dd" because <input type="date"> expects that format.
  const [date, setDate] = useState<string>(
    defaultValues?.date ?? new Date().toISOString().slice(0, 10)
  );

  const [categoryId, setCategoryId] = useState<number>(
    defaultValues?.categoryId ?? defaultCategoryId
  );

  const [description, setDescription] = useState(defaultValues?.description ?? "");

  // If parent passes *new* defaultValues while the component stays mounted,
  // sync them into local state (useful when reusing the modal without unmount).
  useEffect(() => {
    if (!defaultValues) return;
    if (defaultValues.title !== undefined) setTitle(defaultValues.title);
    if (defaultValues.amount !== undefined) setAmount(defaultValues.amount);
    if (defaultValues.type !== undefined) setType(defaultValues.type);
    if (defaultValues.date !== undefined) setDate(defaultValues.date); // "yyyy-MM-dd"
    if (defaultValues.categoryId !== undefined) setCategoryId(defaultValues.categoryId);
    if (defaultValues.description !== undefined) setDescription(defaultValues.description);
  }, [defaultValues]);

  // Submit handler: emit a *complete* TransactionCreate payload.
  // For Update (Partial<…>) this is fine — a full object fits the Partial type.
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const payload: TransactionCreate = {
      title,
      amount: Number(amount),
      description: description.trim() ? description.trim() : undefined,
      date: new Date(date).toISOString(), // convert "yyyy-MM-dd" -> ISO for the API
      type,
      categoryId,
    };

    onSubmit(payload);

    // After submit:
    // - In create flow (no onCancel): reset the form.
    // - In edit flow (onCancel exists): do not reset here; modal will close on success.
    if (!onCancel) {
      setTitle("");
      setAmount(0);
      setDescription("");
      setType("Income");
      setDate(new Date().toISOString().slice(0, 10));
      setCategoryId(defaultCategoryId);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* It’s more accessible to use labels; you can still keep placeholders if you like */}
      <label className={styles.label}>
        <span>Title</span>
        <input
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={submitting}
          placeholder="Title"
        />
      </label>

      <label className={styles.label}>
        <span>Amount</span>
        <input
          className={styles.input}
          type="number"
          step="0.01"
          value={Number.isFinite(amount) ? amount : 0}
          onChange={(e) => setAmount(Number(e.target.value))}
          required
          disabled={submitting}
          placeholder="0.00"
        />
      </label>

      <label className={styles.label}>
        <span>Type</span>
        <select
          className={styles.select}
          value={type}
          onChange={(e) => setType(e.target.value as TransactionType)}
          disabled={submitting}
        >
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
          <option value="Investment">Investment</option>
        </select>
      </label>

      <label className={styles.label}>
        <span>Date</span>
        <input
          className={styles.input}
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          disabled={submitting}
        />
      </label>

      {/* NOTE: If your CategorySelect doesn't accept `disabled`, remove that prop. */}
      <label className={styles.label}>
        <span>Category</span>
        <CategorySelect value={categoryId} onChange={setCategoryId} /* disabled={submitting} */ />
      </label>

      <label className={styles.label}>
        <span>Description (optional)</span>
        <input
          className={styles.input}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={submitting}
          placeholder="Optional"
        />
      </label>

      <div className={styles.actions}>
        <button className={styles.btnPrimary} type="submit" disabled={submitting}>
          {submitLabel}
        </button>

        {onCancel && (
          <button
            className={styles.btn}
            type="button"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}