import { useState } from 'react';
import { useCategories } from '../hooks/useCategories';

// Read categories and show loading/error states
// Create new categories
// Delete categories
// Default Category (Id=1) stays protected

export default function CategoriesPage() {
  const { list, create, remove } = useCategories();
  const [name, setName] = useState("");

  if (list.isLoading) return <p>Loading…</p>;
  if (list.isError) return <p style={{ color: "red" }}>Failed to load categories</p>;

  return (
    <div style={{ maxWidth: 600 }}>
      <h1>Categories</h1>

      <ul style={{ display: "grid", gap: 8, padding: 0, listStyle: "none" }}>
        {list.data!.map((c) => (
          <li key={c.id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span>{c.name}</span>
            {c.id !== 1 && (
              <button
                onClick={() => remove.mutate(c.id)}
                disabled={remove.isPending}
              >
                Delete
              </button>
            )}
          </li>
        ))}
      </ul>

      <hr style={{ margin: "16px 0" }} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          create.mutate(name, {
            onSuccess: () => setName(""),
          });
        }}
        style={{ display: "flex", gap: 8 }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          required
        />
        <button type="submit" disabled={create.isPending}>Create</button>
      </form>
    </div>
  );
}