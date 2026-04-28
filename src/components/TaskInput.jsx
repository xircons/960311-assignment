import { useState } from 'react'

function TaskInput({ onAddTask }) {
  const [inputText, setInputText] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const trimmed = inputText.trim()

    if (!trimmed) {
      return
    }

    onAddTask(trimmed)
    setInputText('')
  }

  return (
    <form className="task-input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputText}
        onChange={(event) => setInputText(event.target.value)}
        placeholder="Enter a task"
        aria-label="Task input"
      />
      <button type="submit">Add Task</button>
    </form>
  )
}

export default TaskInput
