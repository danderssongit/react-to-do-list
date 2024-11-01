export const formatDateForInput = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}

const getDueStatus = (dueDate) => {
  if (!dueDate) return null

  const due = new Date(dueDate)
  const now = new Date()
  const diffMs = due - now

  if (diffMs < 0) {
    const hours = Math.ceil(Math.abs(diffMs) / (1000 * 60 * 60))
    const days = Math.ceil(hours / 24)

    if (days > 1) return `Overdue by ${days} days`
    if (hours > 1) return `Overdue by ${hours} hours`
    return `Overdue by ${Math.ceil(Math.abs(diffMs) / (1000 * 60))} minutes`
  }

  const hours = Math.ceil(diffMs / (1000 * 60 * 60))
  const days = Math.ceil(hours / 24)

  if (days > 1) return `Due in ${days} days`
  if (hours > 1) return `Due in ${hours} hours`
  return `Due in ${Math.ceil(diffMs / (1000 * 60))} minutes`
}

const getCompletedStatus = (completedAt) => {
  const date = new Date(completedAt)
  return `Completed ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`
}

export const getInputLabel = (todo, isNew) => {
  if (isNew) return 'New Todo'
  if (todo.completed) return getCompletedStatus(todo.completedAt)
  if (todo.dueDate) return getDueStatus(todo.dueDate)
  return 'Todo'
}
