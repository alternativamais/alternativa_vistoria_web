/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, IconButton, Card, Rating, Stack } from '@mui/material';
import { EditOutlined } from '@ant-design/icons';
import MainCard from 'components/sistema/MainCard';
import EditarVistoria from './components/editarVistoria';
import { api } from 'services/api';
import { useAuth } from 'hooks/auth';
import { notification } from 'components/notification/index';

const VistoriasInspetor = () => {
  const [vistorias, setVistorias] = useState([]);
  const [vistoriasFiltradas, setVistoriasFiltradas] = useState([]);
  const [pesquisa, setPesquisa] = useState('');
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [vistoriaSelecionada, setVistoriaSelecionada] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    buscarVistorias();
  }, []);

  useEffect(() => {
    filtrarVistorias();
  }, [pesquisa, vistorias]);

  const buscarVistorias = async () => {
    try {
      const response = await api.get(`/vistorias/user/${user.id}`);
      setVistorias(response.data);
      setVistoriasFiltradas(response.data);
    } catch (error) {
      notification({ message: 'Erro ao buscar vistorias!', type: 'error' });
    }
  };

  const filtrarVistorias = () => {
    const filtradas = vistorias.filter((vistoria) => vistoria.nomeCliente.toLowerCase().includes(pesquisa.toLowerCase()));
    setVistoriasFiltradas(filtradas);
  };

  const handleEditarVistoria = (vistoria) => {
    setVistoriaSelecionada(vistoria);
    setModalEditarOpen(true);
  };

  const handleFecharModalEditar = () => {
    setVistoriaSelecionada(null);
    setModalEditarOpen(false);
  };

  const atualizarListaVistorias = () => {
    buscarVistorias();
  };

  const handlePesquisaChange = (event) => {
    setPesquisa(event.target.value);
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px' }}>
        <TextField
          label="Pesquisar por cliente"
          variant="outlined"
          value={pesquisa}
          onChange={handlePesquisaChange}
          sx={{ width: '300px' }}
        />
      </Box>
      <MainCard title="Vistorias">
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            justifyContent: 'center'
          }}
        >
          {vistoriasFiltradas.map((vistoria) => (
            <Card
              key={vistoria.id}
              sx={{
                width: '100%',
                maxWidth: '400px',
                display: 'flex',
                flexDirection: 'column',
                padding: '15px',
                borderRadius: '10px',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#fff'
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ marginBottom: '10px' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {vistoria.nomeCliente}
                </Typography>
                <Rating value={vistoria.nota || 5} readOnly sx={{ fontSize: '1.2rem' }} />
              </Stack>
              <Box sx={{ marginBottom: '15px' }}>
                <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '5px' }}>
                  Tipo: {vistoria.tipoVistoria}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '5px' }}>
                  Endereço: {vistoria.enderecoCliente}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '5px' }}>
                  Status: {vistoria.status}
                </Typography>
                <Typography variant="body2" color="text.secondary" display="flex" justifyContent="space-between" alignItems="center">
                  <div>Agendamento: {new Date(vistoria.dataAgendamento).toLocaleString('pt-BR')}</div>
                  <IconButton onClick={() => handleEditarVistoria(vistoria)}>
                    <EditOutlined />
                  </IconButton>
                </Typography>
              </Box>
            </Card>
          ))}
        </Box>
      </MainCard>
      <EditarVistoria
        open={modalEditarOpen}
        onClose={handleFecharModalEditar}
        onSuccess={atualizarListaVistorias}
        vistoria={vistoriaSelecionada}
      />
    </Box>
  );
};

export default VistoriasInspetor;
