/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField, LinearProgress, Typography, Box } from '@mui/material';

const Checklist = ({ checklistData, checklistSelections, handleSituacaoChange, vistoria }) => {
  const [relatos, setRelatos] = useState({});
  const [percentualConcluido, setPercentualConcluido] = useState(0);

  // Filtrar checklists com tipo "vistoria"
  const filteredChecklistData = checklistData.filter((item) => item.tipo === vistoria.tipoVistoria);

  useEffect(() => {
    const initialRelatos = {};
    filteredChecklistData.forEach((item) => {
      if (checklistSelections[item.id]?.situacao === 'impossibilitado') {
        initialRelatos[item.id] = checklistSelections[item.id]?.motivo || '';
      }
    });
    setRelatos(initialRelatos);
  }, []);

  useEffect(() => {
    const totalItens = filteredChecklistData.length;
    const itensFeitos = filteredChecklistData.filter((item) => checklistSelections[item.id]?.situacao === 'feito').length;
    const percentual = totalItens > 0 ? (itensFeitos / totalItens) * 100 : 0;
    setPercentualConcluido(percentual);
  }, [filteredChecklistData, checklistSelections]);

  const handleRelatoChange = (id, value) => {
    setRelatos((prevRelatos) => ({
      ...prevRelatos,
      [id]: value
    }));

    handleSituacaoChange(id, 'impossibilitado', value);
  };

  return (
    <>
      {/* Barra de progresso */}
      <Box sx={{ width: '100%', marginBottom: '16px' }}>
        <Typography variant="h6" align="center">
          Progresso: {Math.round(percentualConcluido)}%
        </Typography>
        <LinearProgress variant="determinate" value={percentualConcluido} />
      </Box>

      {/* Itens do checklist */}
      {filteredChecklistData.map((item) => (
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
