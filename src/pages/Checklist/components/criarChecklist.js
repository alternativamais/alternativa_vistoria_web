/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, TextField, MenuItem } from '@mui/material';
import { api } from 'services/api';
import { notification } from 'components/notification/index';

const CriarChecklist = ({ open, onClose, onSuccess }) => {
  const initialFormData = {
    item: '',
    tipo: 'cliente', // Valor padrão inicial
    status: true
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (!open) {
      setFormData(initialFormData);
    }
  }, [open]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await api.post('/checklist', formData);
      onSuccess();
      onClose();
      notification({ message: 'Item criado com sucesso!', type: 'success' });
    } catch (error) {
      notification({ message: 'Erro ao criar checklist. Verifique os dados e tente novamente.', type: 'error' });
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-criar-checklist" aria-describedby="modal-criar-checklist-descricao">
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
        <h2 id="modal-criar-checklist">Criar Checklist</h2>
        <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Item" name="item" value={formData.item} onChange={handleChange} fullWidth />
          <TextField label="Tipo" name="tipo" value={formData.tipo} onChange={handleChange} select fullWidth>
            <MenuItem value="cliente">Cliente</MenuItem>
            <MenuItem value="rede">Rede</MenuItem>
          </TextField>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={onClose} color="secondary">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Criar
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default CriarChecklist;
