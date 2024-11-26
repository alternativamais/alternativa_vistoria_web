/* eslint-disable react/prop-types */
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const Checklist = ({ checklistData, checklistSelections, handleSituacaoChange }) => {
  return (
    <>
      {checklistData.map((item) => (
        <>
          <FormControl fullWidth>
            <InputLabel id={`situacao-${item.id}-label`}>{item.item}</InputLabel>
            <Select
              labelId={`situacao-${item.id}-label`}
              value={checklistSelections[item.id]?.situacao || ''}
              onChange={(e) => handleSituacaoChange(item.id, e.target.value)}
            >
              <MenuItem value="Em andamento">Em andamento</MenuItem>
              <MenuItem value="Feito">Feito</MenuItem>
              <MenuItem value="Não feito">Não feito</MenuItem>
            </Select>
          </FormControl>
        </>
      ))}
    </>
  );
};

export default Checklist;
