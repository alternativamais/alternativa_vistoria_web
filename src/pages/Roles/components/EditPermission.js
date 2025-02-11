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

const EditPermission = ({ open, permission, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ name: '', group: '' });

  useEffect(() => {
    if (permission) {
      setFormData({ name: permission.name, group: permission.group });
    }
  }, [permission]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      await api.put(`/permissions/${permission.id}`, formData);
      notification({ message: 'Permissão atualizada com sucesso!', type: 'success' });
      onSuccess();
      onClose();
    } catch (error) {
      notification({ message: 'Erro ao atualizar permissão!', type: 'error' });
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" gutterBottom>
          Editar Permissão
        </Typography>
        <TextField label="Nome" name="name" value={formData.name} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
        <TextField label="Grupo" name="group" value={formData.group} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
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

export default EditPermission;
