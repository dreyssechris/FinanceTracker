import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'; 
import { 
    getTransactions,
    getTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
} from '../api/transactionService';
import type { Transaction, TransactionCreate, TransactionUpdate } from '../contracts/transactions';

/**
 * React Query hook for transactions.
 * - list: read-all query 
 * - byId: read-one query (uses getTransactionById)
 * - create/update/delete: mutations with cache invalidation
 */
export function useTransactions() {
    const queryClient = useQueryClient();

    // Fetch transactions
    const list = useQuery({
        queryKey: ['transactions'],
        queryFn: getTransactions
    })

    // Type inference -> React Query infers the type from the query function (Promise<Transaction>)
    const byId = (id: number) =>
        useQuery({
            queryKey: ['transactions', id],
            queryFn: () => getTransactionById(id), // lazy fetch by id
            enabled: id > 0 // only fetch if id is valid
    });

    const create = useMutation({
        mutationFn: (payload: TransactionCreate) => createTransaction(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions']});
        }
    })

    const update = useMutation({
        mutationFn: ({id, payload }: {id: number, payload: TransactionUpdate}) => 
            updateTransaction(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions']});
        }
    })

  const remove = useMutation({
    mutationFn: (id: number) => deleteTransaction(id),

    // 1) Optimistic Update
    onMutate: async (id: number) => {
      // stop current fetches
      await queryClient.cancelQueries({ queryKey: ['transactions'] });

      // remember previous value (rollback)
      const previous = queryClient.getQueryData<Transaction[]>(['transactions']);

      // remove from cache immediately
      queryClient.setQueryData<Transaction[]>(['transactions'], (old) =>
        old ? old.filter(t => t.id !== id) : old
      );

      // context for onError rollback
      return { previous };
    },

    // 2) If the mutation fails, use the context returned above
    onError: (_err, _id, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(['transactions'], ctx.previous);
      }
    },

    // 3) no matter if it fails or succeeds, refetch the list
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'], refetchType: 'active' });
    },
  });

  return { list, byId, create, update, remove };
}