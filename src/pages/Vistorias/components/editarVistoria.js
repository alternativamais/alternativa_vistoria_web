/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { api } from 'services/api';

const EditarVistoria = ({ open, onClose, onSuccess, vistoria }) => {
  const [formData, setFormData] = useState({
    tipoVistoria: vistoria?.tipoVistoria || 'interna',
    nomeCliente: vistoria?.nomeCliente || '',
    enderecoCliente: vistoria?.enderecoCliente || '',
    idTecnicoDesignado: vistoria?.idTecnicoDesignado || '',
    status: vistoria?.status || 'aberta',
    dataAgendamento: vistoria?.dataAgendamento || ''
  });

  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    if (vistoria) {
      setFormData({
        tipoVistoria: vistoria.tipoVistoria || 'interna',
        nomeCliente: vistoria.nomeCliente || '',
        enderecoCliente: vistoria.enderecoCliente || '',
        idTecnicoDesignado: vistoria.idTecnicoDesignado || '',
        status: vistoria.status || 'aberta',
        dataAgendamento: vistoria.dataAgendamento || ''
      });
    }
  }, [vistoria]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await api.get('/users');
        setUsuarios(response.data.filter((user) => user.status === 'active')); // Filtra apenas usuários ativos
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    fetchUsuarios();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        idTecnicoDesignado: formData.idTecnicoDesignado ? Number(formData.idTecnicoDesignado) : null
      };

      await api.put(`/vistorias/${vistoria.id}`, payload);
      onSuccess();
      onClose();
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
          width: { xs: '90vw', sm: '70vw', md: '600px' },
          maxHeight: '90vh',
          overflowY: 'auto',
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
              <MenuItem value="cliente">Cliente</MenuItem>
              <MenuItem value="rede">Rede</MenuItem>
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
          <TextField
            label="Data de Agendamento"
            name="dataAgendamento"
            type="datetime-local"
            value={formData.dataAgendamento}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{
              shrink: true
            }}
          />
          <FormControl fullWidth>
            <InputLabel id="id-tecnico-designado-label">Técnico Designado</InputLabel>
            <Select
              labelId="id-tecnico-designado-label"
              name="idTecnicoDesignado"
              value={formData.idTecnicoDesignado}
              onChange={handleChange}
            >
              {usuarios.map((usuario) => (
                <MenuItem key={usuario.id} value={usuario.id}>
                  {usuario.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="status-label">Status</InputLabel>
            <Select labelId="status-label" name="status" value={formData.status} onChange={handleChange}>
              <MenuItem value="aberta">Aberta</MenuItem>
              <MenuItem value="fechada">Fechada</MenuItem>
              <MenuItem value="pendente">Pendente</MenuItem>
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
