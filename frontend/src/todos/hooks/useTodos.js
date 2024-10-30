import { useState, useEffect, useRef } from 'react'
import { useDebounce } from '../../utils/hooks'

const areTodosEqual = (todos1, todos2) => {
  if (todos1.length !== todos2.length) return false

  return todos1.every(
    (todo, index) =>
      todo.content === todos2[index].content && todo.completed === todos2[index].completed
  )
}

export const useTodos = (initialTodos, onSave) => {
  const [todos, setTodos] = useState(initialTodos)
  const [isDirty, setIsDirty] = useState(false)
  const previousTodos = useRef(initialTodos)

  const debouncedSave = useDebounce((todos) => {
    if (!isDirty) return

    const nonEmptyTodos = todos.filter((todo) => todo.content.trim())
    if (!areTodosEqual(nonEmptyTodos, previousTodos.current)) {
      onSave(nonEmptyTodos)
      previousTodos.current = nonEmptyTodos
      setIsDirty(false)
    }
  }, 400)

  useEffect(() => {
    debouncedSave(todos)
  }, [todos])

  const addTodo = () => {
    setTodos([...todos, { content: '', completed: false }])
  }

  const updateTodo = (index, content) => {
    setTodos([...todos.slice(0, index), { ...todos[index], content }, ...todos.slice(index + 1)])
    setIsDirty(true)
  }

  const toggleTodo = (index) => {
    const newTodos = [...todos]
    newTodos[index] = {
      ...newTodos[index],
      completed: !newTodos[index].completed,
    }
    setTodos(newTodos)
    setIsDirty(true)
  }

  const deleteTodo = (index) => {
    setTodos([...todos.slice(0, index), ...todos.slice(index + 1)])
    setIsDirty(true)
  }

  return {
    todos,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
  }
}
