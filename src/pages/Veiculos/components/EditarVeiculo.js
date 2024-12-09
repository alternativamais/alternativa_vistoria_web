/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { api } from 'services/api';
import { notification } from 'components/notification/index';

const EditarVeiculo = ({ open, onClose, onSuccess, veiculo }) => {
  const [formData, setFormData] = useState({
    placa: veiculo?.placa || '',
    modelo: veiculo?.modelo || '',
    marca: veiculo?.marca || '',
    cor: veiculo?.cor || '',
    ano: veiculo?.ano || '',
    descricao: veiculo?.descricao || '',
    status: veiculo?.status || 'Disponível'
  });

  useEffect(() => {
    if (veiculo) {
      setFormData({
        placa: veiculo.placa || '',
        modelo: veiculo.modelo || '',
        marca: veiculo.marca || '',
        cor: veiculo.cor || '',
        ano: veiculo.ano || '',
        descricao: veiculo.descricao || '',
        status: veiculo.status || 'Disponível'
      });
    }
  }, [veiculo]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: name === 'ano' ? parseInt(value, 10) || '' : value // Garante que 'ano' seja um número
    });
  };

  const handleSubmit = async () => {
    try {
      // Validação do ano
      if (typeof formData.ano !== 'number' || formData.ano < 1900 || formData.ano > new Date().getFullYear()) {
        notification({ message: 'Ano inválido. Deve ser um número entre 1900 e o ano atual.', type: 'error' });
        return;
      }

      await api.put(`/veiculos/${veiculo.id}`, formData);
      onSuccess(); // Atualiza a lista de veículos após a edição
      onClose(); // Fecha o modal
      notification({ message: 'Veículo editado com sucesso!', type: 'success' });
    } catch (error) {
      notification({ message: 'Erro ao editar veículo. Verifique os dados e tente novamente.', type: 'error' });
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-editar-veiculo" aria-describedby="modal-editar-veiculo-descricao">
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
        <h2 id="modal-editar-veiculo">Editar Veículo</h2>
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
              Salvar
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditarVeiculo;
