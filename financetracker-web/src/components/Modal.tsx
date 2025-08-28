// Overlapping UI Window, that blocks interaction with rest of react site: Modal for viewing, Modal for editing
// Separation of concerns: Modal is 
import { useEffect } from "react";
import styles from "./Modal.module.scss";

type Props = {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode; // Every prop can have children
                             // It is whatever is placed between the opening and closing tags of a component
};

export default function Modal({ isOpen, title, onClose, children }: Props) {
  // Close modal on Escape key press
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    isOpen ? document.addEventListener("keydown", handleKeyDown) : document.removeEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={styles.modal}>
        <header className={styles.header}>
          {title && <h2 id="modal-title" className={styles.title}>{title}</h2>}
          <button 
            type="button" 
            className={styles.closeBtn} 
            onClick={onClose} 
            aria-label="Close modal"
          >
            &times;
          </button>
        </header>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}