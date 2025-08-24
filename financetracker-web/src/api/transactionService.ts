// src/api/transactionService.ts
import { api } from './http';
import type {Category} from './categoryService'; 

/** Enum as string union - matches backend JSON */
export type TransactionType = "Income" | "Expense" | "Investment";

/** Transaction returned by the backend */
export interface Transaction {
    id: number;
    title: string;
    amount: number; 
    description?: string;
    date: string;
    type: TransactionType;
    categoryId: number;
    category?: Category;
}

/** Create DTO */
export interface TransactionCreate {
    title: string;
    amount: number; 
    description?: string;
    date: string;
    type: TransactionType;
    categoryId: number;
}

/** Update DTO */
export interface TransactionUpdate {
    title?: string;
    amount?: number; 
    description?: string;
    date?: string;
    type?: TransactionType;
    categoryId?: number;
}

// GetAll()
export function getTransactions() {
    return api<Transaction[]>('/api/transactions');
}

// GetById()
export function getTransactionById(id: number) {
    return api<Transaction>(`/api/transactions/${id}`); 
}

// Create()
export function createTransaction(transaction: TransactionCreate) {
    return api<Transaction>('/api/transactions', {
        method: 'POST',
        body: JSON.stringify(transaction),
    });
}

// Update() -> void, because backend returns no content
export function updateTransaction(id: number, transaction: TransactionUpdate) {
    return api<void>(`/api/transactions/${id}`, {
        method: "PUT",
        body: JSON.stringify(transaction),
    });
}

// Delete()
export function deleteTransaction(id: number) {
    return api<void>(`/api/transactions/${id}`, {
        method: "DELETE",
    });
}
