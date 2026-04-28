import { useEffect, useState } from 'react'

function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(task.text)

  useEffect(() => {
    setEditText(task.text)
  }, [task.text])

  const handleSave = () => {
    const trimmed = editText.trim()

    if (!trimmed) {
      return
    }

    onEdit(task.id, trimmed)
    setIsEditing(false)
  }

  return (
    <li className={task.completed ? 'completed' : ''}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        aria-label={`Toggle ${task.text}`}
      />
      {isEditing ? (
        <input
          type="text"
          className="edit-input"
          value={editText}
          onChange={(event) => setEditText(event.target.value)}
          aria-label={`Edit ${task.text}`}
        />
      ) : (
        <span>{task.text}</span>
      )}
      {isEditing ? (
        <button type="button" onClick={handleSave}>
          Save
        </button>
      ) : (
        <button type="button" onClick={() => setIsEditing(true)}>
          Edit
        </button>
      )}
      <button type="button" onClick={() => onDelete(task.id)} aria-label={`Delete ${task.text}`}>
        X
      </button>
    </li>
  )
}

export default TaskItem
