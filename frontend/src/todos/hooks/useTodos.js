import { useState, useEffect, useRef } from 'react'
import { useDebounce } from '../../utils/hooks'

const areTodosEqual = (todos1, todos2) => {
  if (todos1.length !== todos2.length) return false

  return todos1.every(
    (todo, index) =>
      todo.content === todos2[index].content &&
      todo.completed === todos2[index].completed &&
      todo.dueDate === todos2[index].dueDate &&
      todo.completedAt === todos2[index].completedAt
  )
}

export const useTodos = (initialTodos = [], onChange) => {
  const [todos, setTodos] = useState(
    initialTodos.length > 0 ? initialTodos : [{ content: '', completed: false, isEditing: true }]
  )
  const previousTodos = useRef(initialTodos)

  const debouncedSave = useDebounce((todos) => {
    const nonEmptyTodos = todos.filter((todo) => todo.content.trim())
    if (!areTodosEqual(nonEmptyTodos, previousTodos.current)) {
      onChange(nonEmptyTodos)
      previousTodos.current = nonEmptyTodos
    }
  }, 400)

  useEffect(() => {
    debouncedSave(todos)
  }, [todos, debouncedSave])

  const addTodo = () => {
    setTodos((todos) => [
      ...todos,
      {
        content: '',
        completed: false,
        dueDate: null,
        isEditing: true,
      },
    ])
  }

  const updateTodo = (index, content, isEditing = true) => {
    setTodos((todos) =>
      todos.map((todo, i) => (i === index ? { ...todo, content, isEditing } : todo))
    )
  }

  const toggleTodo = (index) => {
    setTodos((todos) =>
      todos.map((todo, i) => {
        if (i !== index) return todo
        const isCompleting = !todo.completed
        return {
          ...todo,
          completed: isCompleting,
          completedAt: isCompleting ? new Date().toISOString() : null,
        }
      })
    )
  }

  const deleteTodo = (index) => {
    setTodos((todos) => todos.filter((_, i) => i !== index))
  }

  const updateTodoDueDate = (index, dueDate) => {
    setTodos((todos) => todos.map((todo, i) => (i === index ? { ...todo, dueDate } : todo)))
  }

  return {
    todos,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    updateTodoDueDate,
  }
}
