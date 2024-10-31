import React from 'react'
import { TextField, Checkbox, Typography, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { getInputLabel, formatDateForInput } from '../../utils/dateUtils'
import { getInputStyle } from '../styles/todoStyles'

export const TodoItem = ({
  todo,
  index,
  onContentChange,
  onToggle,
  onDelete,
  onKeyDown,
  onDueDateChange,
  isNew,
  isEditing,
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
      <Typography sx={{ margin: '8px' }} variant='h6'>
        {index + 1}
      </Typography>
      <TextField
        autoFocus={isNew}
        sx={{
          flexGrow: 1,
          marginTop: '1rem',
          ...getInputStyle(todo, isNew),
        }}
        label={getInputLabel(todo, isNew)}
        value={todo.content || ''}
        onChange={(event) => onContentChange(event.target.value)}
        onKeyDown={onKeyDown}
        error={!isNew && todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed}
      />

      {(isNew || isEditing) && (
        <TextField
          type='datetime-local'
          label='Due Date'
          style={{ alignSelf: 'end' }}
          value={formatDateForInput(todo.dueDate)}
          onChange={(event) => {
            const newDate = event.target.value ? new Date(event.target.value).toISOString() : null
            onDueDateChange(newDate)
          }}
          sx={{ width: '200px' }}
          InputLabelProps={{ shrink: true }}
        />
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Checkbox checked={!!todo.completed} onChange={onToggle} />
        <IconButton
          size='small'
          onClick={onDelete}
          sx={{
            color: 'text.secondary',
            '&:hover': {
              color: 'error.main',
            },
          }}
        >
          <DeleteIcon />
        </IconButton>
      </div>
    </div>
  )
}
