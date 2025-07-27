# Demo Chat for Testing

Let me create a sample chat to demonstrate the functionality:

### 🧑‍💻 User

Can you help me understand how React hooks work, specifically useState and useEffect?

---

### 🤖 Assistant

Absolutely! React hooks are functions that let you use state and other React features in functional components. Let me explain the two most commonly used hooks:

## useState Hook

`useState` allows you to add state to functional components:

```javascript
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

**Key points:**
- `useState(0)` initializes state with value 0
- Returns an array: `[currentValue, setterFunction]`
- The setter function triggers a re-render

## useEffect Hook

`useEffect` lets you perform side effects in functional components:

```javascript
import React, { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // This runs after every render
    fetchUser(userId).then(setUser);
  }, [userId]); // Only re-run if userId changes
  
  return user ? <div>{user.name}</div> : <div>Loading...</div>;
}
```

**Key points:**
- Runs after every render by default
- Second argument (dependency array) controls when it runs
- Can return a cleanup function

---

### 🧑‍💻 User

That's really helpful! Can you show me a more complex example that combines both hooks?

---

### 🤖 Assistant

Sure! Here's a more comprehensive example that demonstrates both hooks working together in a real-world scenario:

```javascript
import React, { useState, useEffect } from 'react';

function TodoApp() {
  // State for todos list
  const [todos, setTodos] = useState([]);
  // State for input field
  const [inputValue, setInputValue] = useState('');
  // State for loading
  const [isLoading, setIsLoading] = useState(true);
  // State for filter
  const [filter, setFilter] = useState('all');

  // Load todos when component mounts
  useEffect(() => {
    const loadTodos = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/todos');
        const todosData = await response.json();
        setTodos(todosData);
      } catch (error) {
        console.error('Failed to load todos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();
  }, []); // Empty dependency array = run once on mount

  // Save to localStorage whenever todos change
  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos]); // Run whenever todos array changes

  // Cleanup effect for any subscriptions
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem('todos', JSON.stringify(todos));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup function
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [todos]);

  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo = {
        id: Date.now(),
        text: inputValue,
        completed: false,
        createdAt: new Date().toISOString()
      };
      setTodos(prevTodos => [...prevTodos, newTodo]);
      setInputValue(''); // Clear input
    }
  };

  const toggleTodo = (id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  // Filtered todos based on current filter
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // 'all'
  });

  if (isLoading) {
    return <div className="loading">Loading todos...</div>;
  }

  return (
    <div className="todo-app">
      <h1>Todo App</h1>
      
      {/* Add new todo */}
      <div className="add-todo">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new todo..."
        />
        <button onClick={addTodo}>Add</button>
      </div>

      {/* Filter buttons */}
      <div className="filters">
        {['all', 'active', 'completed'].map(filterType => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={filter === filterType ? 'active' : ''}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
      </div>

      {/* Todo list */}
      <ul className="todo-list">
        {filteredTodos.map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span>{todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {/* Stats */}
      <div className="stats">
        <p>Total: {todos.length}</p>
        <p>Active: {todos.filter(t => !t.completed).length}</p>
        <p>Completed: {todos.filter(t => t.completed).length}</p>
      </div>
    </div>
  );
}

export default TodoApp;
```

This example demonstrates:

1. **Multiple useState calls** for different pieces of state
2. **Multiple useEffect calls** for different side effects:
   - Loading data on mount
   - Saving to localStorage when todos change
   - Setting up/cleaning up event listeners
3. **Dependency arrays** to control when effects run
4. **State updates** that depend on previous state using functional updates
5. **Derived state** (filteredTodos) computed from existing state

The key principles shown here are:
- **Separation of concerns**: Each piece of state has a clear purpose
- **Effect dependencies**: Only re-run effects when necessary
- **Cleanup**: Remove event listeners to prevent memory leaks
- **Functional updates**: Use `prevState => newState` for updates that depend on current state