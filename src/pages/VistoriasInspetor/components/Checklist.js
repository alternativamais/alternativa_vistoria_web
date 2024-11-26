/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';

const Checklist = ({ checklistData, checklistSelections, handleSituacaoChange }) => {
  console.log('checklistSelections', checklistSelections);
  const [relatos, setRelatos] = useState({});

  useEffect(() => {
    const initialRelatos = {};
    checklistData.forEach((item) => {
      if (checklistSelections[item.id]?.situacao === 'impossibilitado') {
        initialRelatos[item.id] = checklistSelections[item.id]?.motivo || '';
      }
    });
    setRelatos(initialRelatos);
  }, [checklistData, checklistSelections]);

  const handleRelatoChange = (id, value) => {
    setRelatos((prevRelatos) => ({
      ...prevRelatos,
      [id]: value
    }));

    handleSituacaoChange(id, 'impossibilitado', value);
  };

  return (
    <>
      {checklistData.map((item) => (
        <div key={item.id}>
          <FormControl fullWidth style={{ marginBottom: '16px' }}>
            <InputLabel id={`situacao-${item.id}-label`}>{item.item}</InputLabel>
            <Select
              labelId={`situacao-${item.id}-label`}
              value={checklistSelections[item.id]?.situacao || ''}
              onChange={(e) => {
                const situacao = e.target.value;
                handleSituacaoChange(item.id, situacao, relatos[item.id] || '');

                if (situacao !== 'impossibilitado') {
                  setRelatos((prevRelatos) => ({
                    ...prevRelatos,
                    [item.id]: ''
                  }));
                }
              }}
            >
              <MenuItem value="feito">Feito</MenuItem>
              <MenuItem value="nao feito">Não feito</MenuItem>
              <MenuItem value="impossibilitado">Impossibilitado</MenuItem>
            </Select>
          </FormControl>

          {checklistSelections[item.id]?.situacao === 'impossibilitado' && (
            <TextField
              fullWidth
              label="Relato"
              placeholder="Descreva o motivo de impossibilidade"
              value={checklistSelections[item.id]?.motivo}
              onChange={(e) => handleRelatoChange(item.id, e.target.value)}
              style={{ marginBottom: '16px' }}
            />
          )}
        </div>
      ))}
    </>
  );
};

export default Checklist;
