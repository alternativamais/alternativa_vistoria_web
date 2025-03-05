/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, TextField } from '@mui/material';
import { api } from 'services/api';
import { notification } from 'components/notification';

const CriarTecnico = ({ open, onClose, onSuccess }) => {
  // Estado para armazenar o nome do técnico
  const [nome, setNome] = useState('');

  // Reseta o formulário sempre que o modal for fechado
  useEffect(() => {
    if (!open) {
      setNome('');
    }
  }, [open]);

  // Handler para submeter o formulário e criar o técnico
  const handleSubmit = async () => {
    try {
      // Envia a requisição POST para criar o técnico
      await api.post('/tecnicos', { nome });
      notification({ message: 'Técnico criado com sucesso!', type: 'success' });
      onSuccess(); // Atualiza a lista de técnicos
      onClose(); // Fecha o modal
    } catch (error) {
      notification({ message: 'Erro ao criar técnico. Verifique os dados e tente novamente!', type: 'error' });
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-criar-tecnico" aria-describedby="modal-criar-tecnico-descricao">
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
        <h2 id="modal-criar-tecnico">Criar Novo Técnico</h2>
        <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Nome" name="nome" value={nome} onChange={(e) => setNome(e.target.value)} fullWidth />
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

export default CriarTecnico;
