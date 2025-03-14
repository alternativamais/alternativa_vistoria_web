/* eslint-disable react/prop-types */
import React from 'react';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const ResumoStatus = ({ formData, handleChange, handleStatusChange }) => {
  return (
    <Box>
      <TextField
        label="Resumo da Vistoria"
        name="resumoVistoria"
        value={formData.resumoVistoria || ''}
        onChange={handleChange}
        fullWidth
        multiline
        rows={3}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel id="status-label" shrink={!!formData.status}>
          Status
        </InputLabel>
        <Select labelId="status-label" name="status" value={formData.status || ''} onChange={handleStatusChange} displayEmpty>
          <MenuItem value="" disabled>
            <em>Selecione o status</em>
          </MenuItem>
          <MenuItem value="a vistoriar">A Vistoriar</MenuItem>
          <MenuItem value="pendente de agendamento">Pendente de Agendamento</MenuItem>
          <MenuItem value="correcao pendente de agendamento">Correção de Instalação</MenuItem>
          <MenuItem value="cancelado">Cancelado</MenuItem>
          <MenuItem value="vistoriado ok">Vistoriado OK</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default ResumoStatus;
