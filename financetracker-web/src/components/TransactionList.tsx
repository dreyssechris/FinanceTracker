// src/components/TransactionList.tsx
import { format, parseISO } from "date-fns";
import type { Transaction } from "../api/transactionService";
import { useCategories } from "../hooks/useCategories";

type Props = {
    items: Transaction[];
    onDelete: (id: number) => void;
};

export default function TransactionList({ items, onDelete }: Props) {
    const { selectById } = useCategories();

    if (items.length === 0) return <p>No transactions yet.</p>;

    return (
      <table cellPadding={6}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Category</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((t) => {
            const cat = selectById(t.categoryId);
            return (
              <tr key={t.id}>
                <td>{format(parseISO(t.date), "yyyy-MM-dd")}</td>
                <td>{t.title}</td>
                <td>{t.type}</td>
                <td>{t.amount.toFixed(2)}</td>
                <td>{cat?.name ?? t.categoryId}</td>
                <td>
                  <button onClick={() => onDelete(t.id)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
}