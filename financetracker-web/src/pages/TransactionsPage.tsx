// src/pages/TransactionsPage.tsx
import { useTransactions } from "../hooks/useTransactions";
import TransactionList from "../components/TransactionList";
import TransactionForm from "../components/TransactionForm";

export default function TransactionsPage() {
  const { list, create, remove } = useTransactions();

  if (list.isLoading) return <p>Loading…</p>;
  if (list.isError) return <p style={{ color: "red" }}>Failed to load transactions</p>;

  return (
    <div style={{ maxWidth: 900 }}>
      <h1>Transactions</h1>

      {/* Liste aller Transaktionen */}
      <TransactionList
        items={list.data ?? []}
        onDelete={(id) => remove.mutate(id)}
      />

      <h2 style={{ marginTop: 16 }}>New Transaction</h2>

      {/* Formular für neue Transaktion */}
      <TransactionForm
        onSubmit={create.mutate}
      />
    </div>
  );
}