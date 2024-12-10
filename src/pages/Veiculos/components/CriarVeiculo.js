/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { api } from 'services/api';
import { notification } from 'components/notification/index';

const CriarVeiculo = ({ open, onClose, onSuccess }) => {
  const initialFormData = {
    placa: null,
    modelo: null,
    marca: null,
    cor: null,
    ano: null,
    descricao: null,
    status: 'Disponível'
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (!open) {
      setFormData(initialFormData);
    }
  }, [open]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: name === 'ano' ? parseInt(value, 10) || null : value // Garante que 'ano' seja um número
    });
  };

  const handleSubmit = async () => {
    try {
      if (typeof formData.ano !== 'number' || formData.ano < 1900 || formData.ano > new Date().getFullYear()) {
        notification({ message: 'Ano inválido. Deve ser um número entre 1900 e o ano atual.', type: 'error' });
        return;
      }
      await api.post('/veiculos', formData);
      onSuccess();
      onClose();
      notification({ message: 'Veículo criado com sucesso!', type: 'success' });
    } catch (error) {
      console.error('Erro ao criar veículo:', error);
      notification({ message: 'Erro ao criar veículo. Verifique os dados e tente novamente!', type: 'error' });
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-criar-veiculo" aria-describedby="modal-criar-veiculo-descricao">
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
        <h2 id="modal-criar-veiculo">Criar Novo Veículo</h2>
        <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Placa" name="placa" value={formData.placa} onChange={handleChange} fullWidth />
          <TextField label="Modelo" name="modelo" value={formData.modelo} onChange={handleChange} fullWidth />
          <TextField label="Marca" name="marca" value={formData.marca} onChange={handleChange} fullWidth />
          <TextField label="Cor" name="cor" value={formData.cor} onChange={handleChange} fullWidth />
          <TextField
            label="Ano"
            name="ano"
            type="number"
            value={formData.ano}
            onChange={handleChange}
            fullWidth
            InputProps={{ inputProps: { min: 1900, max: new Date().getFullYear() } }}
          />
          <TextField label="Descrição" name="descricao" value={formData.descricao} onChange={handleChange} fullWidth multiline rows={3} />
          <FormControl fullWidth>
            <InputLabel id="status-label">Status</InputLabel>
            <Select labelId="status-label" name="status" value={formData.status} onChange={handleChange}>
              <MenuItem value="Disponível">Disponível</MenuItem>
              <MenuItem value="Indisponível">Indisponível</MenuItem>
            </Select>
          </FormControl>
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

export default CriarVeiculo;
