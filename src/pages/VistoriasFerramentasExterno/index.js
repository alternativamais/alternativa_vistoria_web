import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Chip,
  TextField,
  IconButton,
  Tooltip
} from '@mui/material';
import { EditOutlined } from '@ant-design/icons';
import MainCard from 'components/sistema/MainCard';
import { api } from 'services/api';
import { notification } from 'components/notification/index';
// import { useAuth } from 'hooks/auth';
import EditVistoriaModal from './components/EditVistoriaModal';

const VISTORIAR_COLOR = '#2196F3';

const VistoriasFerramentasExterno = () => {
  // const { user } = useAuth();
  const [pesquisa, setPesquisa] = useState(() => {
    const pesquisaSalva = localStorage.getItem('pesquisaVistoriasFerramentasExterno');
    return pesquisaSalva ? pesquisaSalva : '';
  });
  const [dateFilter, setDateFilter] = useState('');
  const [sortColumn] = useState(() => {
    const colunaSalva = localStorage.getItem('sortColumnVistoriasFerramentasExterno');
    return colunaSalva ? colunaSalva : null;
  });
  const [sortDirection] = useState(() => {
    const direcaoSalva = localStorage.getItem('sortDirectionVistoriasFerramentasExterno');
    return direcaoSalva ? direcaoSalva : 'asc';
  });

  const [vistorias, setVistorias] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [vistoriaSelecionada, setVistoriaSelecionada] = useState(null);

  useEffect(() => {
    buscarVistorias();
  }, []);

  useEffect(() => {
    localStorage.setItem('pesquisaVistoriasFerramentasExterno', pesquisa);
  }, [pesquisa]);

  const buscarVistorias = async () => {
    try {
      const response = await api.get(`/vistoria-ferramentas`);
      setVistorias(response.data);
    } catch (error) {
      notification({ message: 'Erro ao buscar vistorias!', type: 'error' });
    }
  };

  const formatarDataParaBrasil = (dataISO) => {
    if (!dataISO) return 'Pendente de Vistoria';
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR');
  };

  const handlePesquisaChange = (event) => {
    setPesquisa(event.target.value);
  };

  const handleDateFilterChange = (event) => {
    setDateFilter(event.target.value);
  };

  const ordenarVistorias = (a, b) => {
    if (!sortColumn) return 0;
    let valorA = '';
    let valorB = '';
    switch (sortColumn) {
      case 'tecnico_nome':
        valorA = a.vistoria.tecnico_nome.toLowerCase();
        valorB = b.vistoria.tecnico_nome.toLowerCase();
        break;
      case 'data_vistoria':
        valorA = a.vistoria.data_vistoria ? new Date(a.vistoria.data_vistoria).getTime() : 0;
        valorB = b.vistoria.data_vistoria ? new Date(b.vistoria.data_vistoria).getTime() : 0;
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

  const vistoriasFiltradas = vistorias.filter((item) => {
    if (item.vistoria.status !== 'a vistoriar') return false;

    const nomeTecnico = item.vistoria.tecnico_nome || '';
    const matchesName = nomeTecnico.toLowerCase().includes(pesquisa.toLowerCase());
    let matchesDate = true;
    if (dateFilter) {
      if (item.vistoria.data_vistoria) {
        const vistoriaDate = new Date(item.vistoria.data_vistoria).toISOString().substring(0, 10);
        matchesDate = vistoriaDate === dateFilter;
      } else {
        matchesDate = false;
      }
    }
    return matchesName && matchesDate;
  });

  const vistoriasOrdenadas = [...vistoriasFiltradas].sort(ordenarVistorias);

  const groupVistoriasByDate = (vistoriasArray) => {
    return vistoriasArray.reduce((acc, item) => {
      let dateKey;
      if (item.vistoria.data_vistoria) {
        const d = new Date(item.vistoria.data_vistoria);
        dateKey = d.toLocaleDateString('pt-BR');
      } else {
        dateKey = 'Pendente de Vistoria';
      }
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(item);
      return acc;
    }, {});
  };

  const groupedVistorias = groupVistoriasByDate(vistoriasOrdenadas);

  const sortedGroupKeys = Object.keys(groupedVistorias).sort((a, b) => {
    if (a === 'Pendente de Vistoria') return 1;
    if (b === 'Pendente de Vistoria') return -1;
    const [dayA, monthA, yearA] = a.split('/');
    const [dayB, monthB, yearB] = b.split('/');
    const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
    const dateB = new Date(`${yearB}-${monthB}-${dayB}`);
    return dateA - dateB;
  });

  const getAvatarLetter = (nome) => {
    return nome && nome.length > 0 ? nome[0] : '?';
  };

  const handleEditarClick = (vistoriaId) => {
    setVistoriaSelecionada(vistoriaId);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setVistoriaSelecionada(null);
  };

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
          label="Pesquisar por técnico"
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

      <MainCard title="Vistorias de Ferramentas">
        {sortedGroupKeys.length > 0 ? (
          sortedGroupKeys.map((dateKey) => (
            <Box key={dateKey} sx={{ marginBottom: 3 }}>
              <Typography variant="h5" sx={{ marginBottom: 2 }}>
                {dateKey}
              </Typography>
              <Grid container spacing={3}>
                {groupedVistorias[dateKey].map((item) => {
                  const { vistoria, itens } = item;
                  return (
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
                          avatar={<Avatar sx={{ bgcolor: VISTORIAR_COLOR }}>{getAvatarLetter(vistoria.tecnico_nome)}</Avatar>}
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
                              {vistoria.tecnico_nome}
                            </Typography>
                          }
                          subheader={formatarDataParaBrasil(vistoria.data_vistoria)}
                        />
                        {itens.length > 0 && (
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              Ferramentas:
                            </Typography>
                            {itens.map((itemFerramenta) => (
                              <Typography key={itemFerramenta.id} variant="body2" color="text.primary">
                                {itemFerramenta.ferramenta_nome}
                              </Typography>
                            ))}
                          </CardContent>
                        )}
                        <CardActions sx={{ justifyContent: 'flex-end' }}>
                          <Tooltip title="Editar">
                            <IconButton onClick={() => handleEditarClick(vistoria.id)}>
                              <EditOutlined />
                            </IconButton>
                          </Tooltip>
                        </CardActions>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          ))
        ) : (
          <Typography variant="h6" sx={{ textAlign: 'center', marginTop: '20px' }}>
            Nenhuma vistoria encontrada para a data selecionada.
          </Typography>
        )}
      </MainCard>

      {/* Modal de Edição */}
      <EditVistoriaModal open={modalAberto} onClose={fecharModal} vistoriaId={vistoriaSelecionada} />
    </Box>
  );
};

export default VistoriasFerramentasExterno;
