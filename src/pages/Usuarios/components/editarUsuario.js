/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { api } from 'services/api';

const EditarUsuario = ({ open, onClose, onSuccess, usuario }) => {
  const [formData, setFormData] = useState({
    name: usuario?.name || '',
    username: usuario?.username || '',
    email: usuario?.email || '',
    password: '', // Campo de senha vazio por padrão
    birthday: usuario?.birthday || '',
    status: usuario?.status || 'active'
  });

  useEffect(() => {
    if (usuario) {
      setFormData({
        name: usuario.name || '',
        username: usuario.username || '',
        email: usuario.email || '',
        password: '', // Senha não preenchida por padrão
        birthday: usuario.birthday || '',
        status: usuario.status || 'active'
      });
    }
  }, [usuario]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      // Remove o campo password se estiver vazio
      const dataToSend = { ...formData };
      if (!dataToSend.password) {
        delete dataToSend.password;
      }

      await api.put(`/users/${usuario.id}`, dataToSend);
      onSuccess(); // Atualiza a lista de usuários após a edição
      onClose(); // Fecha o modal
    } catch (error) {
      console.error('Erro ao editar usuário:', error);
      alert('Erro ao editar usuário. Verifique os dados e tente novamente.');
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-editar-usuario" aria-describedby="modal-editar-usuario-descricao">
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
        <h2 id="modal-editar-usuario">Editar Usuário</h2>
        <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Nome" name="name" value={formData.name} onChange={handleChange} fullWidth />
          <TextField label="Username" name="username" value={formData.username} onChange={handleChange} fullWidth />
          <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} fullWidth />
          <TextField label="Senha" name="password" type="password" value={formData.password} onChange={handleChange} fullWidth />
          <TextField
            label="Data de Nascimento"
            name="birthday"
            type="date"
            value={formData.birthday}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth>
            <InputLabel id="status-label">Status</InputLabel>
            <Select labelId="status-label" name="status" value={formData.status} onChange={handleChange}>
              <MenuItem value="active">Ativo</MenuItem>
              <MenuItem value="inactive">Inativo</MenuItem>
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

export default EditarUsuario;
