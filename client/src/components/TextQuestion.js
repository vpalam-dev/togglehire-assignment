import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export function TextQuestion({ value, onChange, label }) {
  return (
    <Box sx={{ width: '100%' }}>
      <TextField
        label={label}
        multiline
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        fullWidth
      />
    </Box>
  )
}