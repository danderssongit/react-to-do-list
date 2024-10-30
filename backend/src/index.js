import express from 'express'
import cors from 'cors'
import Database from 'better-sqlite3'

const PORT = 3001
const app = express()
const db = new Database('todos.db')

app.use(cors())
app.use(express.json())

db.exec(`
  CREATE TABLE IF NOT EXISTS todo_lists (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    list_id TEXT NOT NULL,
    content TEXT NOT NULL,
    completed BOOLEAN DEFAULT 0,
    FOREIGN KEY (list_id) REFERENCES todo_lists(id)
  );
`)

app.get('/api/todo-lists', (_, res) => {
  try {
    const lists = db.prepare('SELECT * FROM todo_lists ORDER BY id').all()
    const result = {}

    for (const list of lists) {
      const todos = db
        .prepare('SELECT content, completed FROM todos WHERE list_id = ?')
        .all(list.id)
      result[list.id] = {
        id: list.id,
        title: list.title,
        todos: todos.map((todo) => ({
          content: todo.content,
          completed: todo.completed,
        })),
      }
    }

    res.json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/todo-lists/:id', (req, res) => {
  const { id } = req.params

  try {
    const list = db.prepare('SELECT * FROM todo_lists WHERE id = ?').get(id)

    if (!list) {
      return res.status(404).json({ error: 'List not found...' })
    }

    const todos = db.prepare('SELECT content FROM todos WHERE list_id = ?').all(id)

    const result = {
      id: list.id,
      title: list.title,
      todos: todos.map((todo) => todo.content),
    }

    res.json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/todo-lists/:id', (req, res) => {
  const { id } = req.params
  const { title, todos } = req.body

  const insertList = db.prepare('INSERT OR REPLACE INTO todo_lists (id, title) VALUES (?, ?)')
  const deleteTodos = db.prepare('DELETE FROM todos WHERE list_id = ?')
  const insertTodo = db.prepare('INSERT INTO todos (list_id, content, completed) VALUES (?, ?, ?)')

  try {
    insertList.run(id, title || '')
    deleteTodos.run(id)

    for (const todo of todos) {
      const content = todo.content || ''
      const completed = todo.completed ? 1 : 0
      insertTodo.run(id, content, completed)
    }

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.delete('/api/todo-lists/:id', (req, res) => {
  const { id } = req.params
  const deleteList = db.prepare('DELETE FROM todo_lists WHERE id = ?')
  const deleteTodos = db.prepare('DELETE FROM todos WHERE list_id = ?')

  try {
    db.transaction(() => {
      deleteTodos.run(id)
      deleteList.run(id)
    })()

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(PORT, () => console.log(`Todo list server listening on port ${PORT}!`))
