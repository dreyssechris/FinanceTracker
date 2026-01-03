import { useEffect, useRef } from "react";
import styles from "./Modal.module.scss";
import type { PropsWithChildren } from "react";
import { X } from "lucide-react";

type Props = {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  closeOnBackdrop?: boolean; // default: true
} & PropsWithChildren;

/* A11y-focused modal:
   - Focus trap (simple: focus first element)
   - ESC to close
   - Backdrop click to close
*/
export default function Modal({
   isOpen,
   title, 
   onClose, 
   children,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) 
      return;

    // Close on ESC
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") 
        onClose();
    };
    window.addEventListener("keydown", onKey);

    // Move focus into the dialog
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.focus();

    return () => {
      window.removeEventListener("keydown", onKey);
      prev?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onMouseDown={onClose} /* close on backdrop click */>
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={title ?? "Dialog"}
        onMouseDown={(e) => e.stopPropagation()} // prevent backdrop close when clicking inside
        tabIndex={-1}
        ref={ref}
      >
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <X />
        </button>
        {title && <div className={styles.header}><h2>{title}</h2></div>}
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}
