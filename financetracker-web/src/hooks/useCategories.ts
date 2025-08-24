import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'; 
import { getCategories, createCategory, updateCategory, deleteCategory, type Category } from '../api/categoryService';
import {use} from 'react';

export function useCategories() {
    const queryClient = useQueryClient();

    // Fetch categories
    const list = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories
    })

    // Selector from cache by id without refetching
    const selectById = (id: number): Category | undefined => {
        const data = queryClient.getQueryData<Category[]>(['categories']);
        return data?.find(c => c.id === id); 
    }
    
    const create = useMutation({
        mutationFn: (name: string) => createCategory(name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories']}); 
        }
    })

    const update = useMutation({
        mutationFn: ({id, name}: {id: number, name: string}) => updateCategory(id, name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories']}); 
        }
    })

    const remove = useMutation({
        mutationFn: (id: number) => deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories']});
        }
    })

    return { list, selectById, create, update, remove };
}