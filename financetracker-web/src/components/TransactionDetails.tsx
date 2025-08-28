import { format, parseISO } from "date-fns";
import type { Transaction } from "../contracts/transactions";
import { useCategories } from "../hooks/useCategories";
import styles from "./TransactionDetails.module.scss";

type Props = {
  tx: Transaction; // the transaction to display in read-only mode
};

export default function TransactionDetails({ tx }: Props) {
  // We look up the category name from the cache (normalized data pattern).
  const { selectById } = useCategories();
  const category = selectById(tx.categoryId);

  return (
    // A simple definition list: label/value pairs
    <dl className={styles.grid}>
      <dt>Date</dt>
      <dd>{format(parseISO(tx.date), "yyyy-MM-dd")}</dd>

      <dt>Title</dt>
      <dd>{tx.title}</dd>

      <dt>Type</dt>
      <dd>{tx.type}</dd>

      <dt>Amount</dt>
      <dd>{tx.amount.toFixed(2)} €</dd>

      <dt>Category</dt>
      <dd>{category?.name ?? tx.categoryId}</dd>

      {tx.description && (
        <>
          <dt>Description</dt>
          <dd>{tx.description}</dd>
        </>
      )}
    </dl>
  );
}