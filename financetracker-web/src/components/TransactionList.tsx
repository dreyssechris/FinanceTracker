// src/components/TransactionList.tsx
import { format, parseISO } from "date-fns";
import type { Transaction } from "../contracts/transactions";
import { useCategories } from "../hooks/useCategories";
import styles from "./TransactionList.module.scss";

// Icons displayed in the transaction list 
import { BanknoteX, BanknoteArrowUpIcon, PiggyBank, CircleX, Eye, Pencil} from "lucide-react";

type Props = {
    items: Transaction[];
    onView: (t: Transaction) => void; 
    onEdit: (t: Transaction) => void; 
    onDelete: (id: number) => void;
};

export default function TransactionList({ items, onView, onEdit ,onDelete }: Props) {
    const { selectById } = useCategories();

    if (items.length === 0) 
      return <p>No transactions yet.</p>;

    return (
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.iconCell} scope="col" >
              <span className={styles.srOnly}>Type icon</span> {/* Screen reader only text for accessibility */}  
            </th>
            <th className={styles.hideOnMobile} scope="col">Date</th>
            <th className={styles.hideOnMobile} scope="col">Title</th>
            <th className={styles.hideOnMobile} scope="col">Type</th>
            <th scope="col">Amount</th>
            <th className={styles.hideOnMobile} scope="col">Category</th>
            <th aria-label="Actions" />
            <th />
            <th />
          </tr>
        </thead>
        <tbody>
          {items.map((t) => {
            const cat = selectById(t.categoryId);

            // Specific icons for transaction types
            const TypeIcon = 
            t.type === "Income" ? BanknoteArrowUpIcon :
            t.type === "Expense" ? BanknoteX :
              PiggyBank;

            // Specific row styles for transaction types - get specific class name
            const rowIconTypeClass =
              t.type === "Income" ? "type-income" :
              t.type === "Expense" ? "type-expense" :
              "type-investment";

            return (
              <tr key={t.id} className={styles[rowIconTypeClass]}> {/* Apply specific class */}
                {/* On mobile, the icon cell will visually act as a left stripe/icon. */}
                <td className={styles.iconCell} data-label=" ">
                  <TypeIcon className={styles.icon} aria-hidden />
                </td>
                <td className={styles.hideOnMobile} >{format(parseISO(t.date), "yyyy-MM-dd")}</td>
                <td className={styles.hideOnMobile} >{t.title}</td>
                <td className={styles.hideOnMobile} >{t.type}</td>
                <td>{t.amount.toFixed(2)}{"€"}</td>
                <td className={styles.hideOnMobile} >{cat?.name ?? t.categoryId}</td>
                <td>
                  <button 
                    title="View"
                    type="button"
                    className={styles.viewBtn} 
                    aria-label={`View transaction ${t.title}`}
                    onClick={() => onView(t)}
                  >
                    <Eye className={styles.viewIcon} aria-hidden />
                  </button>
                </td>
                <td>
                  <button 
                    title="Edit"
                    type="button"
                    className={styles.editBtn} 
                    aria-label={`Edit transaction ${t.title}`}
                    onClick={() => onEdit(t)}
                  >
                    <Pencil className={styles.editIcon} aria-hidden />
                  </button>
                </td>
                <td>
                  <button
                    title="Delete"
                    type="button"
                    className={styles.deleteBtn}
                    aria-label={`Delete transaction ${t.title}`}
                    onClick={() => onDelete(t.id)}
                  >
                    <CircleX className={styles.deleteIcon} aria-hidden />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
}