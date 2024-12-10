/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Button, Modal, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { api } from 'services/api';
import { notification } from 'components/notification/index';

const EditarVistoria = ({ open, onClose, onSuccess, vistoria }) => {
  const [formData, setFormData] = useState({
    tipoVistoria: vistoria?.tipoVistoria || 'interna',
    nomeCliente: vistoria?.nomeCliente || null,
    enderecoCliente: vistoria?.enderecoCliente || null,
    idTecnicoDesignado: vistoria?.idTecnicoDesignado || null,
    status: vistoria?.status || 'aberta',
    dataAgendamento: vistoria?.dataAgendamento || null
  });

  const [usuarios, setUsuarios] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    if (vistoria) {
      setFormData({
        tipoVistoria: vistoria.tipoVistoria || 'interna',
        nomeCliente: vistoria.nomeCliente || null,
        enderecoCliente: vistoria.enderecoCliente || null,
        idTecnicoDesignado: vistoria.idTecnicoDesignado || null,
        status: vistoria.status || 'aberta',
        dataAgendamento: vistoria.dataAgendamento || null
      });
    }
  }, [vistoria]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await api.get('/users');
        setUsuarios(response.data.filter((user) => user.status === 'active'));
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        notification({ message: 'Erro ao buscar usuários!', type: 'error' });
      }
    };

    fetchUsuarios();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'nomeCliente') {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      setSearchTimeout(
        setTimeout(() => {
          performSearch(value);
        }, 2000)
      );
    }
  };

  const performSearch = useCallback(async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const formattedTerm = term.trim().replace(/\s+/g, '+');
      const response = await api.get(`/sgp-integration/search?term=${formattedTerm}`);
      setSearchResults(response.data);
    } catch (error) {
      notification({ message: 'Erro ao realizar pesquisa!', type: 'error' });
    }
  }, []);

  const handleSelectResult = (event) => {
    const selectedId = event.target.value;
    const selectedResult = searchResults.find((result) => result.id === selectedId);

    if (selectedResult) {
      setFormData({
        ...formData,
        nomeCliente: selectedResult.text,
        enderecoCliente: selectedResult.address
      });
    }

    // Limpa os resultados para ocultar o Select
    setSearchResults([]);
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
      notification({ message: 'Vistoria editada com sucesso!', type: 'success' });
    } catch (error) {
      console.error('Erro ao editar vistoria:', error);
      notification({ message: 'Erro ao editar vistoria. Verifique os dados e tente novamente!', type: 'error' });
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
          {searchResults.length > 0 && (
            <FormControl fullWidth>
              <InputLabel id="search-results-label">Selecione um Cliente</InputLabel>
              <Select labelId="search-results-label" value="" onChange={handleSelectResult}>
                {searchResults.map((result) => (
                  <MenuItem key={result.id} value={result.id}>
                    {result.text}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
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
