import { useEffect, useState } from 'react'
import './App.css'
import TaskInput from './components/TaskInput'
import TaskItem from './components/TaskItem'

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('todo-tasks')

    if (!savedTasks) {
      return []
    }

    try {
      return JSON.parse(savedTasks)
    } catch {
      return []
    }
  })
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    localStorage.setItem('todo-tasks', JSON.stringify(tasks))
  }, [tasks])

  const handleAddTask = (text) => {
    const newTask = {
      id: Date.now(),
      text,
      completed: false,
    }

    setTasks((previousTasks) => [...previousTasks, newTask])
  }

  const handleToggle = (id) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  const handleDelete = (id) => {
    setTasks((previousTasks) => previousTasks.filter((task) => task.id !== id))
  }

  const clearCompleted = () => {
    setTasks((previousTasks) => previousTasks.filter((task) => !task.completed))
  }

  const handleEdit = (id, newText) => {
    const trimmed = newText.trim()

    if (!trimmed) {
      return
    }

    setTasks((previousTasks) =>
      previousTasks.map((task) => (task.id === id ? { ...task, text: trimmed } : task)),
    )
  }

  const handleSelectAll = (event) => {
    const isChecked = event.target.checked

    setTasks((previousTasks) =>
      previousTasks.map((task) => ({
        ...task,
        completed: isChecked,
      })),
    )
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') {
      return !task.completed
    }

    if (filter === 'completed') {
      return task.completed
    }

    return true
  })

  const remainingCount = tasks.filter((task) => !task.completed).length
  const allSelected = tasks.length > 0 && tasks.every((task) => task.completed)

  return (
    <main className="app-shell">
      <div className="app-container">
        <header className="app-header">
          <h1>Interactive To-Do List</h1>
          <p>Track tasks with a strict dark brutalist interface.</p>
        </header>

        <TaskInput onAddTask={handleAddTask} />

        <section className="top-controls" aria-label="Task controls">
          <label className="select-all-control">
            <input type="checkbox" checked={allSelected} onChange={handleSelectAll} />
            <span>Select All</span>
          </label>
          <div className="remaining-badge" aria-live="polite">
            Remaining: {remainingCount}
          </div>
        </section>

        <section className="filter-section" aria-label="Task filters">
          <button
            type="button"
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            type="button"
            className={filter === 'active' ? 'active' : ''}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            type="button"
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </section>

        <ul className="task-list">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </ul>

        <button type="button" className="clear-button" onClick={clearCompleted}>
          Clear Completed
        </button>
      </div>
    </main>
  )
}

export default App
