import { useState } from 'react'
import './App.css'
import TaskInput from './components/TaskInput'
import TaskItem from './components/TaskItem'

function App() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Read React docs', completed: false },
    { id: 2, text: 'Build the to-do interface', completed: true },
    { id: 3, text: 'Review state management', completed: false },
  ])
  const [filter, setFilter] = useState('all')

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

  const handleClearCompleted = () => {
    setTasks((previousTasks) => previousTasks.filter((task) => !task.completed))
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

  return (
    <main className="app-shell">
      <div className="app-container">
        <header className="app-header">
          <h1>Interactive To-Do List</h1>
          <p>Track tasks with a strict dark brutalist interface.</p>
        </header>

        <TaskInput onAddTask={handleAddTask} />

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
            />
          ))}
        </ul>

        <button type="button" className="clear-button" onClick={handleClearCompleted}>
          Clear Completed
        </button>
      </div>
    </main>
  )
}

export default App
