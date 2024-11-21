/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { api } from 'services/api';

const CriarVistoria = ({ open, onClose, onSuccess }) => {
  const initialFormData = {
    tipoVistoria: 'interna',
    nomeCliente: '',
    enderecoCliente: '',
    coordenadasCto: '',
    coordenadasEnderecoCliente: '',
    resumoVistoria: '',
    idUsuarioAbertura: 6,
    idTecnicoDesignado: 6,
    status: 'aberta'
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
      await api.post('/vistorias', formData);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao criar vistoria:', error);
      alert('Erro ao criar vistoria. Verifique os dados e tente novamente.');
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-criar-vistoria" aria-describedby="modal-criar-vistoria-descricao">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: '8px'
        }}
      >
        <h2 id="modal-criar-vistoria">Criar Nova Vistoria</h2>
        <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="tipo-vistoria-label">Tipo de Vistoria</InputLabel>
            <Select labelId="tipo-vistoria-label" name="tipoVistoria" value={formData.tipoVistoria} onChange={handleChange}>
              <MenuItem value="interna">Interna</MenuItem>
              <MenuItem value="externa">Externa</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Nome do Cliente" name="nomeCliente" value={formData.nomeCliente} onChange={handleChange} fullWidth />
          <TextField
            label="Endereço do Cliente"
            name="enderecoCliente"
            value={formData.enderecoCliente}
            onChange={handleChange}
            fullWidth
          />
          <TextField label="Coordenadas CTO" name="coordenadasCto" value={formData.coordenadasCto} onChange={handleChange} fullWidth />
          <TextField
            label="Coordenadas do Endereço do Cliente"
            name="coordenadasEnderecoCliente"
            value={formData.coordenadasEnderecoCliente}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Resumo da Vistoria"
            name="resumoVistoria"
            value={formData.resumoVistoria}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
          />
          <FormControl fullWidth>
            <InputLabel id="status-label">Status</InputLabel>
            <Select labelId="status-label" name="status" value={formData.status} onChange={handleChange}>
              <MenuItem value="aberta">Aberta</MenuItem>
              <MenuItem value="fechada">Fechada</MenuItem>
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

export default CriarVistoria;
