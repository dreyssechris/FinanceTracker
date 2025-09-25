import { useState } from "react";
import type { Transaction } from "../contracts/transactions";

// Hook to manage month state and provide navigation handlers
export function useMonth(initialYear: number, initialMonth: number) {
    const [year, setYear] = useState(initialYear); // e.g., 2024
    const [month, setMonth] = useState(initialMonth); // 0-11
    const previousMonth = () => {
        if (month === 0) {
            setYear(year - 1);
            setMonth(11);
        } else {
            setMonth(month - 1);
        }
    };

    const nextMonth = () => {
        if (month === 11) {
            setYear(year + 1);
            setMonth(0);
        } else {
            setMonth(month + 1);
        }
    }

    return { year, month, previousMonth, nextMonth, setMonth };
}

export function filterTransactionByMonth(transactions: Transaction[], year: number, month: number) {
    const result: Transaction[] = [];

    for (const tx of transactions) {
        const date = new Date(tx.date);
        const sameYear = date.getFullYear() === year; // e.g., 2024
        const sameMonth = date.getMonth() === month; // 0-11

        if (sameYear && sameMonth)
            result.push(tx);
    }

    return result;
}

export function totalsByType(transactions: Transaction[]) {
    let income = 0, expense = 0, investment = 0, netCashFlow = 0; 

    for (const tx of transactions) {
        switch (tx.type) {
            case "Income": income += tx.amount;
            break;
            case "Expense": expense += tx.amount;
            break;
            case "Investment": investment += tx.amount; 
        }
    }

    netCashFlow = income - expense; 

    return { income, expense, investment, netCashFlow }; 
}

