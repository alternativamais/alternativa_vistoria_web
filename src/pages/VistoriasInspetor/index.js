/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  CardMedia,
  Avatar,
  Typography,
  Chip,
  TextField,
  IconButton,
  Tooltip
} from '@mui/material';
import { EditOutlined } from '@ant-design/icons';
import MainCard from 'components/sistema/MainCard';
import EditarVistoria from './components/EditarVistoria';
import { api } from 'services/api';
import { notification } from 'components/notification/index';
import { useAuth } from 'hooks/auth';

const VISTORIAR_COLOR = '#2196F3';

const VistoriasInspetor = () => {
  const { user } = useAuth();

  const [pesquisa, setPesquisa] = useState(() => {
    const pesquisaSalva = localStorage.getItem('pesquisaVistoriasInsp');
    return pesquisaSalva ? pesquisaSalva : '';
  });
  const [dateFilter, setDateFilter] = useState('');

  const [sortColumn] = useState(() => {
    const colunaSalva = localStorage.getItem('sortColumnVistoriasInsp');
    return colunaSalva ? colunaSalva : null;
  });
  const [sortDirection] = useState(() => {
    const direcaoSalva = localStorage.getItem('sortDirectionVistoriasInsp');
    return direcaoSalva ? direcaoSalva : 'asc';
  });

  const [vistorias, setVistorias] = useState([]);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [vistoriaSelecionada, setVistoriaSelecionada] = useState(null);

  useEffect(() => {
    buscarVistorias();
  }, []);

  useEffect(() => {
    localStorage.setItem('pesquisaVistoriasInsp', pesquisa);
  }, [pesquisa]);

  const buscarVistorias = async () => {
    try {
      const response = await api.get(`/vistorias/user/${user.id}`);
      setVistorias(response.data);
    } catch (error) {
      notification({ message: 'Erro ao buscar vistorias!', type: 'error' });
    }
  };

  const formatarDataHoraParaBrasil = (dataISO) => {
    if (!dataISO) return 'Pendente de Agendamento';
    const data = new Date(dataISO);
    return data.toLocaleString('pt-BR');
  };

  const handlePesquisaChange = (event) => {
    setPesquisa(event.target.value);
  };

  const handleDateFilterChange = (event) => {
    setDateFilter(event.target.value);
  };

  const handleEditarVistoria = (vistoria) => {
    setVistoriaSelecionada(vistoria);
    setModalEditarOpen(true);
  };

  const handleFecharModalEditar = () => {
    setVistoriaSelecionada(null);
    setModalEditarOpen(false);
  };

  const ordenarVistorias = (a, b) => {
    if (!sortColumn) return 0;
    let valorA = '';
    let valorB = '';
    switch (sortColumn) {
      case 'nomeCliente':
        valorA = a.nomeCliente.toLowerCase();
        valorB = b.nomeCliente.toLowerCase();
        break;
      case 'dataAgendamento':
        valorA = a.dataAgendamento ? new Date(a.dataAgendamento).getTime() : 0;
        valorB = b.dataAgendamento ? new Date(b.dataAgendamento).getTime() : 0;
        break;
      default:
        return 0;
    }
    if (valorA < valorB) {
      return sortDirection === 'asc' ? -1 : 1;
    } else if (valorA > valorB) {
      return sortDirection === 'asc' ? 1 : -1;
    } else {
      return 0;
    }
  };

  const vistoriasFiltradas = vistorias.filter((vistoria) => {
    const matchesName = vistoria.nomeCliente.toLowerCase().includes(pesquisa.toLowerCase());
    let matchesDate = true;
    if (dateFilter) {
      if (vistoria.dataAgendamento) {
        const agendamentoDate = new Date(vistoria.dataAgendamento).toISOString().substring(0, 10);
        matchesDate = agendamentoDate === dateFilter;
      } else {
        matchesDate = false;
      }
    }
    return matchesName && matchesDate;
  });

  const vistoriasOrdenadas = [...vistoriasFiltradas].sort(ordenarVistorias);

  const groupVistoriasByDate = (vistoriasArray) => {
    return vistoriasArray.reduce((acc, vistoria) => {
      let dateKey;
      if (vistoria.dataAgendamento) {
        const d = new Date(vistoria.dataAgendamento);
        dateKey = d.toLocaleDateString('pt-BR');
      } else {
        dateKey = 'Pendente de Agendamento';
      }
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(vistoria);
      return acc;
    }, {});
  };

  const groupedVistorias = groupVistoriasByDate(vistoriasOrdenadas);

  const sortedGroupKeys = Object.keys(groupedVistorias).sort((a, b) => {
    if (a === 'Pendente de Agendamento') return 1;
    if (b === 'Pendente de Agendamento') return -1;
    const [dayA, monthA, yearA] = a.split('/');
    const [dayB, monthB, yearB] = b.split('/');
    const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
    const dateB = new Date(`${yearB}-${monthB}-${dayB}`);
    return dateA - dateB;
  });

  const getAvatarLetter = (nome) => {
    return nome && nome.length > 0 ? nome[0] : '?';
  };

  const placeholderImage = 'https://via.placeholder.com/500x250?text=Imagem+da+Vistoria';

  return (
    <Box sx={{ padding: '20px' }}>
      {/* Barra de filtros */}
      <Box
        sx={{
          display: 'flex',
          gap: '10px',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          paddingBottom: '10px'
        }}
      >
        <TextField
          label="Pesquisar por cliente"
          variant="outlined"
          value={pesquisa}
          onChange={handlePesquisaChange}
          sx={{ width: '300px' }}
        />
        <TextField
          label="Filtrar por data"
          type="date"
          variant="outlined"
          value={dateFilter}
          onChange={handleDateFilterChange}
          sx={{ width: '200px' }}
          InputLabelProps={{
            shrink: true
          }}
        />
      </Box>

      <MainCard title="Vistorias">
        {sortedGroupKeys.length > 0 ? (
          sortedGroupKeys.map((dateKey) => (
            <Box key={dateKey} sx={{ marginBottom: 3 }}>
              <Typography variant="h5" sx={{ marginBottom: 2 }}>
                {dateKey}
              </Typography>
              <Grid container spacing={3}>
                {groupedVistorias[dateKey].map((vistoria) => (
                  <Grid item xs={12} sm={6} md={4} key={vistoria.id} sx={{ display: 'flex' }}>
                    <Card
                      variant="outlined"
                      sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '10px'
                      }}
                    >
                      <CardHeader
                        avatar={<Avatar sx={{ bgcolor: VISTORIAR_COLOR }}>{getAvatarLetter(vistoria.nomeCliente)}</Avatar>}
                        action={
                          <Chip
                            label={vistoria.status}
                            size="small"
                            sx={{
                              backgroundColor: VISTORIAR_COLOR,
                              color: '#fff'
                            }}
                          />
                        }
                        title={
                          <Typography
                            variant="h6"
                            sx={{
                              whiteSpace: 'normal',
                              wordBreak: 'break-word',
                              maxWidth: 'calc(100% - 50px)'
                            }}
                          >
                            {vistoria.nomeCliente}
                          </Typography>
                        }
                        subheader={formatarDataHoraParaBrasil(vistoria.dataAgendamento)}
                      />
                      {vistoria.imagem && <CardMedia component="img" height="150" image={placeholderImage} alt="Imagem da vistoria" />}
                      <CardContent sx={{ flexGrow: 1, overflow: 'hidden' }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical'
                          }}
                        >
                          {vistoria.enderecoCliente}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'flex-end' }}>
                        <Tooltip title="Editar">
                          <IconButton onClick={() => handleEditarVistoria(vistoria)}>
                            <EditOutlined />
                          </IconButton>
                        </Tooltip>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))
        ) : (
          <Typography variant="h6" sx={{ textAlign: 'center', marginTop: '20px' }}>
            Nenhuma vistoria encontrada para a data selecionada.
          </Typography>
        )}
      </MainCard>

      <EditarVistoria open={modalEditarOpen} onClose={handleFecharModalEditar} onSuccess={buscarVistorias} vistoria={vistoriaSelecionada} />
    </Box>
  );
};

export default VistoriasInspetor;
