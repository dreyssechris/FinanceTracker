// src/components/TransactionForm.tsx
import { useState } from "react";
import CategorySelect from "./CategorySelect";
import type { TransactionCreate, TransactionType } from "../api/transactionService";

type Props = {
  onSubmit: (input: TransactionCreate) => void;
  defaultCategoryId?: number;
};

export default function TransactionForm({ onSubmit, defaultCategoryId = 1 }: Props) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<TransactionType>("Income");
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10)); // yyyy-MM-dd
  const [categoryId, setCategoryId] = useState<number>(defaultCategoryId);
  const [description, setDescription] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          title,
          amount: Number(amount),
          description: description ?? "",
          date: new Date(date).toISOString(),
          type,
          categoryId,
        });
        // simple reset
        setTitle("");
        setAmount(0);
        setDescription("");
      }}
      style={{ display: "grid", gap: 8, maxWidth: 480 }}
    >
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <input
        placeholder="Amount"
        type="number"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        required
      />

      <select value={type} onChange={(e) => setType(e.target.value as TransactionType)}>
        <option value="Income">Income</option>
        <option value="Expense">Expense</option>
        <option value="Investment">Investment</option>
      </select>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <CategorySelect value={categoryId} onChange={setCategoryId} />

      <input
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button type="submit">Create</button>
    </form>
  );
}
