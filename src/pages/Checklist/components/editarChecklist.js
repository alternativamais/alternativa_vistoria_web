/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { api } from 'services/api';

const EditarChecklist = ({ open, onClose, onSuccess, checklist }) => {
  const [formData, setFormData] = useState({
    item: checklist?.item || '',
    status: checklist?.status || true
  });

  useEffect(() => {
    if (checklist) {
      setFormData({
        item: checklist.item || '',
        status: checklist.status || true
      });
    }
  }, [checklist]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await api.put(`/checklist/${checklist.id}`, formData);
      onSuccess(); // Atualiza a lista de checklists após a edição
      onClose(); // Fecha o modal
    } catch (error) {
      console.error('Erro ao editar checklist:', error);
      alert('Erro ao editar checklist. Verifique os dados e tente novamente.');
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-editar-checklist" aria-describedby="modal-editar-checklist-descricao">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: '8px'
        }}
      >
        <h2 id="modal-editar-checklist">Editar Checklist</h2>
        <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Item" name="item" value={formData.item} onChange={handleChange} fullWidth />
          <FormControl fullWidth>
            <InputLabel id="status-label">Status</InputLabel>
            <Select labelId="status-label" name="status" value={formData.status} onChange={handleChange}>
              <MenuItem value={true}>Ativo</MenuItem>
              <MenuItem value={false}>Inativo</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={onClose} color="secondary">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Salvar
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditarChecklist;
