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
  const [gruposVistorias, setGruposVistorias] = useState([]);
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

  useEffect(() => {
    const grupos = agruparVistoriasPorData(vistoriasFiltradas);
    setGruposVistorias(grupos);
  }, [vistoriasFiltradas]);

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
    const filtradas = vistorias.filter((vistoria) => {
      return vistoria.nomeCliente.toLowerCase().includes(pesquisa.toLowerCase());
    });
    setVistoriasFiltradas(filtradas);
  };

  const agruparVistoriasPorData = (lista) => {
    const agrupadas = lista.reduce((acc, vistoria) => {
      const data = new Date(vistoria.dataAgendamento);

      const dataString = data.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });

      if (!acc[dataString]) {
        acc[dataString] = [];
      }
      acc[dataString].push(vistoria);
      return acc;
    }, {});

    const gruposArray = Object.keys(agrupadas).map((data) => ({
      data,
      vistorias: agrupadas[data]
    }));

    gruposArray.sort((a, b) => {
      const [diaA, mesA, anoA] = a.data.split('/');
      const [diaB, mesB, anoB] = b.data.split('/');
      const dataA = new Date(anoA, mesA - 1, diaA);
      const dataB = new Date(anoB, mesB - 1, diaB);
      return dataB - dataA;
    });

    return gruposArray;
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
      {/* Campo de pesquisa */}
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
        {/* Renderização dos grupos de vistorias por data */}
        {gruposVistorias.map((grupo, index) => (
          <Box key={index} sx={{ marginBottom: '20px' }}>
            {/* Título do grupo com a data */}
            <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
              {grupo.data}
            </Typography>

            {/* Lista de vistorias daquele dia */}
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px',
                justifyContent: 'center'
              }}
            >
              {grupo.vistorias.map((vistoria) => (
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
          </Box>
        ))}
      </MainCard>

      {/* Modal de edição de vistoria */}
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
