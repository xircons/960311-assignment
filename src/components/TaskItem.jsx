function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className={task.completed ? 'completed' : ''}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        aria-label={`Toggle ${task.text}`}
      />
      <span>{task.text}</span>
      <button type="button" onClick={() => onDelete(task.id)} aria-label={`Delete ${task.text}`}>
        X
      </button>
    </li>
  )
}

export default TaskItem
