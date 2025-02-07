/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  IconButton,
  Typography
} from '@mui/material';
import CloseCircleOutlined from '@ant-design/icons';
import { api } from 'services/api';
import { notification } from 'components/notification/index';

const EditarCorrecao = ({ open, onClose, onSuccess, vistoria }) => {
  const [formData, setFormData] = useState({
    tipoVistoria: vistoria?.tipoVistoria || 'interna',
    nomeCliente: vistoria?.nomeCliente || null,
    enderecoCliente: vistoria?.enderecoCliente || null,
    idTecnicoDesignado: vistoria?.idTecnicoDesignado || null,
    status: vistoria?.status || 'aberta',
    dataAgendamentoCorrecao: vistoria?.dataAgendamentoCorrecao || null,
    dataConclusaoCorrecao: vistoria?.dataConclusaoCorrecao || null
  });

  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showClose, setShowClose] = useState(false);

  useEffect(() => {
    if (vistoria) {
      setFormData({
        tipoVistoria: vistoria.tipoVistoria || 'interna',
        nomeCliente: vistoria.nomeCliente || null,
        enderecoCliente: vistoria.enderecoCliente || null,
        idTecnicoDesignado: vistoria.idTecnicoDesignado || null,
        status: vistoria.status || 'aberta',
        dataAgendamentoCorrecao: vistoria.dataAgendamentoCorrecao || null,
        dataConclusaoCorrecao: vistoria.dataConclusaoCorrecao || null
      });
    }
  }, [vistoria]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await api.get('/users');
        setUsuarios(
          response.data.filter(
            (user) => user.name === 'Caique Santos Silva' || user.name === 'Arnaldo Batista' || user.name === 'Miller Gomes'
          )
        );
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        notification({ message: 'Erro ao buscar usuários!', type: 'error' });
      }
    };

    fetchUsuarios();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    let newState = { ...formData, [name]: value };

    if (name === 'status') {
      if (value === 'correcao ok') {
        const now = new Date();
        const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

        newState.dataConclusaoCorrecao = localDateTime;
      } else {
        newState.dataConclusaoCorrecao = null;
      }
    }

    setFormData(newState);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setShowClose(false);
    const timer = setTimeout(() => {
      setShowClose(true);
    }, 5000);

    try {
      const payload = {
        ...formData,
        idTecnicoDesignado: formData.idTecnicoDesignado ? Number(formData.idTecnicoDesignado) : null
      };

      await api.put(`/vistorias/${vistoria.id}`, payload);
      clearTimeout(timer);
      setIsLoading(false);
      onSuccess();
      onClose();
      notification({ message: 'Vistoria editada com sucesso!', type: 'success' });
    } catch (error) {
      clearTimeout(timer);
      setIsLoading(false);
      console.error('Erro ao editar vistoria:', error);
      notification({
        message: 'Erro ao editar vistoria. Verifique os dados e tente novamente!',
        type: 'error'
      });
    }
  };

  return (
    <>
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

            <TextField label="Nome do Cliente" name="nomeCliente" value={formData.nomeCliente || ''} onChange={handleChange} fullWidth />

            <TextField
              label="Endereço do Cliente"
              name="enderecoCliente"
              value={formData.enderecoCliente || ''}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Data de Agendamento"
              name="dataAgendamentoCorrecao"
              type="datetime-local"
              value={formData.dataAgendamentoCorrecao || ''}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
            />

            {formData.dataConclusaoCorrecao && (
              <TextField
                label="Data Conclusão da Correção"
                name="dataConclusaoCorrecao"
                type="datetime-local"
                value={formData.dataConclusaoCorrecao}
                onChange={handleChange}
                fullWidth
                InputProps={{
                  readOnly: true
                }}
                InputLabelProps={{
                  shrink: true
                }}
              />
            )}

            <FormControl fullWidth>
              <InputLabel id="id-tecnico-designado-label">Técnico Designado</InputLabel>
              <Select
                labelId="id-tecnico-designado-label"
                name="idTecnicoDesignado"
                value={formData.idTecnicoDesignado || ''}
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
                <MenuItem value="correcao pendente de agendamento">Correção Pendente de Agendamento</MenuItem>
                <MenuItem value="correcao impedida">Correção Impedida</MenuItem>
                <MenuItem value="correcao agendada">Correção Agendada</MenuItem>
                <MenuItem value="correcao ok">Correção OK</MenuItem>
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

      {/** Modal de carregamento */}
      <Modal
        open={isLoading}
        onClose={() => {
          if (showClose) setIsLoading(false);
        }}
        disableEscapeKeyDown={!showClose}
        aria-labelledby="modal-loading"
        aria-describedby="modal-loading-descricao"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.paper',
            borderRadius: '8px',
            p: 4,
            outline: 'none'
          }}
        >
          {showClose && (
            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
              <IconButton onClick={() => setIsLoading(false)}>
                <CloseCircleOutlined />
              </IconButton>
            </Box>
          )}
          <CircularProgress />
          <Typography sx={{ mt: 2 }}>Carregando, por favor aguarde...</Typography>
        </Box>
      </Modal>
    </>
  );
};

export default EditarCorrecao;
