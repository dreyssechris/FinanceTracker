// src/pages/TransactionsPage.tsx
// React imports:
//    - useState: to keep track of which transaction is currently *viewed* or *edited*.
//    - useMemo: optional optimization to avoid re-computing derived lists on every render.
import { useMemo, useState } from "react";
import { useTransactions } from "../hooks/useTransactions";
import TransactionList from "../components/TransactionList";
import TransactionForm from "../components/TransactionForm";
import TransactionDetails from "../components/TransactionDetails";
import Modal from "../components/Modal";
import MonthPicker from "../components/MonthPicker";
import { useMonth, filterTransactionByMonth, totalsByType } from "../hooks/useMonth"; 
import styles from "./TransactionPage.module.scss";
import { Plus } from "lucide-react";

// Using `import type` guarantees these types do not end up in the JS bundle.
import type { 
  Transaction,
  TransactionCreate,
  TransactionUpdate 
} from "../contracts/transactions";

/**
 * Helper: Convert ISO date (e.g., "2025-08-28T00:00:00.000Z")
 * into "yyyy-MM-dd", which <input type="date"> expects.
 * If your form accepts ISO already, adjust accordingly.
 */
function toDateInputValue(iso: string) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * NEW: One unified modal state (a "discriminated union"):
 * - 'closed'      -> no modal visible
 * - 'view'  + tx  -> show read-only details for transaction
 * - 'edit'  + tx  -> show edit form prefilled with transaction
 * - 'create'      -> show empty form to create a new transaction
 *
 * This replaces having multiple booleans; it guarantees only
 * ONE modal can be open at a time and makes switching trivial.
 */
type ModalState =
  | { kind: "closed" }
  | { kind: "view"; tx: Transaction }
  | { kind: "edit"; tx: Transaction }
  | { kind: "create" };


export default function TransactionsPage() {
  // Grab list + mutations from the hook.
  //    - list: React Query useQuery result (isLoading, isError, data)
  //    - create: create.mutate(payload) to POST
  //    - update: update.mutate({ id, payload }) to PUT/PATCH
  //    - remove: remove.mutate(id) to DELETE (already set up with optimistic update)
  const { list, create, update, remove } = useTransactions();

  // NEW: single source of truth for which modal to show (or none)
  const [modal, setModal] = useState<ModalState>({ kind: "closed" });

  // --- Month state (your simple hook with local time) ---
  const now = new Date();

  const { year, month, previousMonth, nextMonth, setMonth } = useMonth(
    now.getFullYear(),
    now.getMonth()
  );

  // Items to render in the list.
  //     useMemo is optional here, but shows the pattern:
  //     if later sorted or filtered, no need to recompute unless `list.data` changes.
  //     Call hook before something is returned!
  const allTransactions = useMemo(
    () => list.data ?? [], [list.data]
  );

  const monthTransactions = useMemo(
    () => filterTransactionByMonth(allTransactions, year, month),
    [allTransactions, year, month] // recompute only if these change
  );

  const { income, expense, investment, netCashFlow } = useMemo(
    () => totalsByType(monthTransactions), [monthTransactions]
  );

  const eur = useMemo(
    () => new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }), []
  );
  
  if (list.isLoading) {
    return (
      <div className={styles.state}>
        <p>Loading…</p>
      </div>
    );
  }
  
  if (list.isError) {
    return (
      <div className={`${styles.state} ${styles.stateError}`}>
        <p>Failed to load Ledger</p>
      </div>
    );
  }

  // Set a proper title per modal kind (nice for a11y and clarity)
  const modalTitle =
    modal.kind === "view"
      ? "Transaction details"
      : modal.kind === "edit"
      ? "Edit transaction"
      : modal.kind === "create"
      ? "New transaction"
      : undefined;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Ledger</h1>
      
      {/* --- Month Picker above the list --- */}
      <div className={styles.monthBar}>
        <MonthPicker
          year={year}
          month={month}
          onPrevious={previousMonth}
          onNext={nextMonth}
          onMonthChange={setMonth}
        />
      </div>

      {/* NEW: Toolbar above the table with a single icon button to open CREATE modal */}
      <div className={styles.toolbar}>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={() => setModal({ kind: "create" })}
          aria-label="Add new transaction"
          title="Add transaction"
        >
          <Plus className={styles.icon} aria-hidden />
        </button>
        {/* NEW: Monats-Summen */}
        <div className={styles.summary}>
          <div className={`${styles.card} ${styles.income}`}>
            {eur.format(income)}
          </div>
          <div className={`${styles.card} ${styles.expense}`}>
            {eur.format(expense)}
          </div>
          <div className={`${styles.card} ${styles.investment}`}>
            {eur.format(investment)}
          </div>
          <div className={`${styles.card} ${styles.net} ${netCashFlow >= 0 ? styles.positive : styles.negative}`}>
            {eur.format(netCashFlow)}
          </div>
        </div>
      </div>

      {/*
        The TransactionList is *presentational*:
            - It RECEIVES data via props.
            - It EMITS events up via callbacks (onView/onEdit/onDelete).
            - It does NOT import hooks or call APIs itself.
            This "props down, events up" pattern keeps the list reusable and dumb.

            onView:   when the user clicks View on a row, we set `viewing` to that transaction
            onEdit:   when the user clicks Edit on a row, we set `editing` to that transaction
            onDelete: when the user clicks Delete, we directly call remove.mutate(id)
      */}
      <TransactionList // Callback not inside List, because List is dumb/presentational
        items={monthTransactions}
        onView={(t) => setModal({ kind: "view", tx: t })}
        onEdit={(t) => setModal({ kind: "edit", tx: t })}
        onDelete={(id) => remove.mutate(id)}
      />

      {/* ONE REUSABLE MODAL FOR ALL MODES.
          Driven from `modal.kind` and render different children */}
      <Modal
        isOpen={modal.kind !== "closed"}
        title={modalTitle}
        onClose={() => setModal({ 
          kind: "closed" 
        })}
      >
      {/* VIEW CONTENT */}
        {modal.kind === "view" && <TransactionDetails tx={modal.tx} />}

        {/* EDIT CONTENT: same TransactionForm, just prefilled and with a different submit target */}
        {modal.kind === "edit" && (
          <TransactionForm
            defaultValues={{
              title: modal.tx.title,
              amount: modal.tx.amount,
              description: modal.tx.description ?? "",
              date: toDateInputValue(modal.tx.date), // prepare for <input type="date">
              type: modal.tx.type,
              categoryId: modal.tx.categoryId,
            }}
            submitting={update.isPending}
            submitLabel="Save changes"
            onSubmit={(values: TransactionUpdate) =>
              update.mutate(
                { id: modal.tx.id, payload: values },
                { onSuccess: () => setModal({ 
                  kind: "closed" 
                })
              }
              )
            }
            onCancel={() => setModal({ kind: "closed" })}
          />
        )}

        {/* CREATE CONTENT: same TransactionForm without defaults, but a different submit target */}
        {modal.kind === "create" && (
          <TransactionForm
            submitting={create.isPending}
            submitLabel="Create"
            onSubmit={(values: TransactionCreate) =>
              create.mutate(values, {
                 onSuccess: () => setModal({
                   kind: "closed" 
                  }) 
                })
            }
          />
        )}
      </Modal>
    </div>
  );
}