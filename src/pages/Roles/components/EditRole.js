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

const EditRole = ({ open, role, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    if (role) {
      setFormData({ name: role.name, description: role.description });
    }
  }, [role]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      await api.put(`/roles/${role.id}`, formData);
      notification({
        message: 'Role atualizado com sucesso!',
        type: 'success'
      });
      onSuccess();
      onClose();
    } catch (error) {
      notification({ message: 'Erro ao atualizar role!', type: 'error' });
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" gutterBottom>
          Editar Role
        </Typography>
        <TextField label="Nome" name="name" value={formData.name} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
        <TextField label="Descrição" name="description" value={formData.description} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={onClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Salvar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditRole;
