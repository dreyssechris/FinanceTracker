import styles from "./MonthPicker.module.scss"; 
import { ChevronLeft } from "lucide-react";
import { ChevronRight } from "lucide-react";

type Props = {
    // "YYYY-MM""
    year: number;
    month: number;
    onPrevious: () => void;
    onNext: () => void;
    onMonthChange?: (m: number) => void;
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function MonthPicker({ 
  year, 
  month, 
  onPrevious, 
  onNext, 
  onMonthChange
}: Props) {
  
  return (
    <div className={styles.wrap} aria-label="month selection">
      <button 
        type="button" 
        onClick={onPrevious} 
        aria-label="previous month" 
        className={styles.navigation}
      >
        <ChevronLeft />
      </button> 
      <div className={styles.center}>
        <select
          className={styles.select}
          value={month}
          onChange={
            (e) => onMonthChange?.(Number(e.target.value))
          }
          aria-label="select month"
        >
          {MONTHS.map((m, i) => <option key={m} value={i}>{m} {year}</option>)}
        </select>
      </div>
      <button 
        type="button" 
        onClick={onNext} 
        aria-label="next month" 
        className={styles.navigation}
      >
        <ChevronRight />
      </button>
    </div>
  );
}