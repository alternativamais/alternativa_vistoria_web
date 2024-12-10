/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { api } from 'services/api';
import { notification } from 'components/notification/index';

const CriarAtendimento = ({ open, onClose, onSuccess }) => {
  const initialFormData = {
    veiculoId: '',
    vistoriaId: '',
    status: 'pendente',
    kmSaida: '',
    kmChegada: '',
    horarioSaida: '',
    horarioChegada: '',
    observacao: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [veiculos, setVeiculos] = useState([]);
  const [vistorias, setVistorias] = useState([]);

  useEffect(() => {
    if (open) {
      fetchVeiculos();
      fetchVistorias();
    } else {
      setFormData(initialFormData);
    }
  }, [open]);

  const fetchVeiculos = async () => {
    try {
      const response = await api.get('/veiculos');
      setVeiculos(response.data);
    } catch (error) {
      notification({ message: 'Erro ao buscar veículos!', type: 'error' });
    }
  };

  const fetchVistorias = async () => {
    try {
      const response = await api.get('/vistorias/user/1');
      setVistorias(response.data);
    } catch (error) {
      notification({ message: 'Erro ao buscar vistorias!', type: 'error' });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: name.includes('km') ? parseInt(value, 10) || '' : value // Garantir que km seja numérico
    });
  };

  const handleSubmit = async () => {
    try {
      await api.post('/atendimentos', formData);
      onSuccess();
      onClose();
      notification({ message: 'Atendimento criado com sucesso!', type: 'success' });
    } catch (error) {
      console.error('Erro ao criar atendimento:', error);
      notification({ message: 'Erro ao criar atendimento. Verifique os dados e tente novamente!', type: 'error' });
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-criar-atendimento" aria-describedby="modal-criar-atendimento-descricao">
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
        <h2 id="modal-criar-atendimento">Criar Novo Atendimento</h2>
        <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="veiculo-label">Veículo</InputLabel>
            <Select labelId="veiculo-label" name="veiculoId" value={formData.veiculoId} onChange={handleChange}>
              {veiculos.map((veiculo) => (
                <MenuItem key={veiculo.id} value={veiculo.id}>
                  {`${veiculo.modelo} - ${veiculo.marca} (${veiculo.placa})`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="vistoria-label">Vistoria</InputLabel>
            <Select labelId="vistoria-label" name="vistoriaId" value={formData.vistoriaId} onChange={handleChange}>
              {vistorias.map((vistoria) => (
                <MenuItem key={vistoria.id} value={vistoria.id}>
                  {`${vistoria.nomeCliente}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="status-label">Status</InputLabel>
            <Select labelId="status-label" name="status" value={formData.status} onChange={handleChange}>
              <MenuItem value="pendente">Pendente</MenuItem>
              <MenuItem value="aberta">Aberta</MenuItem>
              <MenuItem value="fechada">Fechada</MenuItem>
            </Select>
          </FormControl>
          <TextField label="KM Saída" name="kmSaida" type="number" value={formData.kmSaida} onChange={handleChange} fullWidth />
          <TextField label="KM Chegada" name="kmChegada" type="number" value={formData.kmChegada} onChange={handleChange} fullWidth />
          <TextField
            label="Horário de Saída"
            name="horarioSaida"
            type="datetime-local"
            value={formData.horarioSaida}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Horário de Chegada"
            name="horarioChegada"
            type="datetime-local"
            value={formData.horarioChegada}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Observação"
            name="observacao"
            value={formData.observacao}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
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

export default CriarAtendimento;
