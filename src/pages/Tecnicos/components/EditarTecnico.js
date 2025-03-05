/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, TextField } from '@mui/material';
import { api } from 'services/api';
import { notification } from 'components/notification';

const EditarTecnico = ({ open, onClose, onSuccess, tecnico }) => {
  // Estado para armazenar o nome do técnico
  const [nome, setNome] = useState('');

  // Preenche o formulário com os dados do técnico quando o componente receber os dados
  useEffect(() => {
    if (tecnico) {
      setNome(tecnico.nome);
    }
  }, [tecnico]);

  // Reseta o formulário quando o modal é fechado
  useEffect(() => {
    if (!open) {
      setNome('');
    }
  }, [open]);

  // Handler para atualizar o técnico via PUT para /tecnicos/{id}
  const handleSubmit = async () => {
    try {
      await api.put(`/tecnicos/${tecnico.id}`, { nome });
      notification({ message: 'Técnico atualizado com sucesso!', type: 'success' });
      onSuccess(); // Atualiza a lista de técnicos
      onClose(); // Fecha o modal
    } catch (error) {
      notification({ message: 'Erro ao atualizar técnico. Verifique os dados e tente novamente!', type: 'error' });
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-editar-tecnico" aria-describedby="modal-editar-tecnico-descricao">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90vw', sm: '400px' },
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: '8px'
        }}
      >
        <h2 id="modal-editar-tecnico">Editar Técnico</h2>
        <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Nome" name="nome" value={nome} onChange={(e) => setNome(e.target.value)} fullWidth />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={onClose} color="secondary">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Atualizar
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditarTecnico;
