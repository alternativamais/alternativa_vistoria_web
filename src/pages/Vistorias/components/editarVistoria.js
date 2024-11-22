/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { api } from 'services/api';

const EditarVistoria = ({ open, onClose, onSuccess, vistoria }) => {
  const [formData, setFormData] = useState({
    tipoVistoria: vistoria?.tipoVistoria || 'interna',
    nomeCliente: vistoria?.nomeCliente || '',
    enderecoCliente: vistoria?.enderecoCliente || '',
    coordenadasCto: vistoria?.coordenadasCto || '',
    coordenadasEnderecoCliente: vistoria?.coordenadasEnderecoCliente || '',
    resumoVistoria: vistoria?.resumoVistoria || '',
    idTecnicoDesignado: vistoria?.idTecnicoDesignado || '',
    status: vistoria?.status || 'aberta'
  });

  useEffect(() => {
    if (vistoria) {
      setFormData({
        tipoVistoria: vistoria.tipoVistoria || 'interna',
        nomeCliente: vistoria.nomeCliente || '',
        enderecoCliente: vistoria.enderecoCliente || '',
        coordenadasCto: vistoria.coordenadasCto || '',
        coordenadasEnderecoCliente: vistoria.coordenadasEnderecoCliente || '',
        resumoVistoria: vistoria.resumoVistoria || '',
        idTecnicoDesignado: vistoria.idTecnicoDesignado || '',
        status: vistoria.status || 'aberta'
      });
    }
  }, [vistoria]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await api.put(`/vistorias/${vistoria.id}`, formData);
      onSuccess(); // Atualiza a lista de vistorias após a edição
      onClose(); // Fecha o modal
    } catch (error) {
      console.error('Erro ao editar vistoria:', error);
      alert('Erro ao editar vistoria. Verifique os dados e tente novamente.');
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-editar-vistoria" aria-describedby="modal-editar-vistoria-descricao">
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
        <h2 id="modal-editar-vistoria">Editar Vistoria</h2>
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
          <TextField
            label="ID Técnico Designado"
            name="idTecnicoDesignado"
            value={formData.idTecnicoDesignado}
            onChange={handleChange}
            fullWidth
            type="number"
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
              Salvar
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditarVistoria;
