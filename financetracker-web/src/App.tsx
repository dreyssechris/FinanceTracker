import { useEffect, useState } from 'react'
import './App.css'

interface Category {
  id: number;
  name: string; 
}

function App() {

  const [categories, setCategories] = useState<Category[]>([]); 

  useEffect(() => {
    fetch('/api/categories')
      .then(response => response.json())
      .then(data => setCategories(data)); 
  }, []);


  return (
    <div>
      <h1>FinanceTracker Categories</h1>
      <ul>
        {categories.map(c => (
          <li key={c.id}>{c.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App
