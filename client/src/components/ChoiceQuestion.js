import React, { useMemo } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export function ChoiceQuestion({ label, options, value, onChange }) {
  const sortedOptions = useMemo(() => {
    return options.slice().sort(o => o.weight);
  }, [options]);

  return (
    <FormControl component="fieldset" sx={{ width: '100%' }}>
      <FormLabel component="legend">{label}</FormLabel>
      <RadioGroup value={value} onChange={e => onChange(e.target.value)}>
        {sortedOptions.map(o => <FormControlLabel key={o.id} value={o.id} control={<Radio />} label={o.body} />)}
      </RadioGroup>
    </FormControl>
  );
}