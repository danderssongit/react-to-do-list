const formatTimeRemaining = (dueDate) => {
  if (!dueDate) return null

  const due = new Date(dueDate)
  const now = new Date()

  if (isNaN(due.getTime())) return 'Invalid date'

  const isPast = due < now
  const diffTime = Math.abs(due - now)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))

  if (isPast) {
    if (diffDays > 1) return `Overdue by ${diffDays} days`
    if (diffHours > 1) return `Overdue by ${diffHours} hours`
    return 'Overdue'
  }

  if (diffDays > 1) return `Due in ${diffDays} days`
  if (diffHours > 1) return `Due in ${diffHours} hours`
  return 'Due soon'
}

const formatDate = (date) => {
  if (!date) return ''

  const d = new Date(date)
  if (isNaN(d.getTime())) return 'Invalid date'

  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })
}

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

  if (diffMs < 0) return 'Overdue'

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
