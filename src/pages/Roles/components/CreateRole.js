/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import { api } from 'services/api';
import { notification } from 'components/notification/index';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  p: 4,
  borderRadius: 2
};

const CreateRole = ({ open, onClose, onSuccess }) => {
  const initialData = { name: '', description: '' };
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    if (open) setFormData(initialData);
  }, [open]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      await api.post('/roles', formData);
      notification({ message: 'Role criado com sucesso!', type: 'success' });
      onSuccess();
      onClose();
    } catch (error) {
      notification({ message: 'Erro ao criar role!', type: 'error' });
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" gutterBottom>
          Criar Role
        </Typography>
        <TextField label="Nome" name="name" value={formData.name} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
        <TextField label="Descrição" name="description" value={formData.description} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={onClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Criar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateRole;
