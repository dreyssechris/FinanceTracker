import { useCategories } from "../hooks/useCategories";

type Props = {
  value: number;
  onChange: (id: number) => void;
  disabled?: boolean;
};

export default function CategorySelect({ value, onChange, disabled }: Props) {
  const { list } = useCategories();

  if (list.isLoading) {
    return (
      <select disabled>
        <option>Loading…</option>
      </select>
    );
  }

  if (list.isError) {
    return <span style={{ color: "red" }}>Failed to load categories</span>;
  }

  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      disabled={disabled}
    >
      {list.data!.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </select>
  );
}


