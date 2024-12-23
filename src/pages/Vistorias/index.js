/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  TextField,
  IconButton,
  Tooltip,
  TableSortLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { EditOutlined, PictureOutlined, EyeOutlined } from '@ant-design/icons';
import MainCard from 'components/sistema/MainCard';
import CriarVistoria from './components/criarVistoria';
import EditarVistoria from './components/editarVistoria';
import VerDetalhesVistoria from './components/VerDetalhesVistoria';
import { api } from 'services/api';
import { Link } from 'react-router-dom';
import { notification } from 'components/notification/index';

const Vistorias = () => {
  const [vistorias, setVistorias] = useState([]);
  const [vistoriasFiltradas, setVistoriasFiltradas] = useState([]);

  const [page, setPage] = useState(() => {
    const paginaSalva = localStorage.getItem('paginaVistorias');
    return paginaSalva ? parseInt(paginaSalva, 10) : 0;
  });

  const [rowsPerPage, setRowsPerPage] = useState(() => {
    const linhasSalvas = localStorage.getItem('linhasPorPaginaVistorias');
    return linhasSalvas ? parseInt(linhasSalvas, 10) : 5;
  });

  const [pesquisa, setPesquisa] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('');
  const [modalCriarOpen, setModalCriarOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [vistoriaSelecionada, setVistoriaSelecionada] = useState(null);

  // Novo estado para controlar o modal de detalhes
  const [modalDetalhesOpen, setModalDetalhesOpen] = useState(false);
  const [vistoriaDetalhes, setVistoriaDetalhes] = useState(null);

  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    buscarVistorias();
  }, []);

  useEffect(() => {
    filtrarVistorias();
  }, [pesquisa, vistorias, statusFiltro]);

  useEffect(() => {
    localStorage.setItem('paginaVistorias', page.toString());
  }, [page]);

  useEffect(() => {
    localStorage.setItem('linhasPorPaginaVistorias', rowsPerPage.toString());
  }, [rowsPerPage]);

  const buscarVistorias = async () => {
    try {
      const response = await api.get('/vistorias');
      setVistorias(response.data);
      setVistoriasFiltradas(response.data);
    } catch (error) {
      notification({ message: 'Erro ao buscar vistorias!', type: 'error' });
    }
  };

  const filtrarVistorias = () => {
    let filtradas = vistorias;

    if (pesquisa.trim() !== '') {
      filtradas = filtradas.filter((vistoria) => vistoria.nomeCliente.toLowerCase().includes(pesquisa.toLowerCase()));
    }

    if (statusFiltro.trim() !== '') {
      filtradas = filtradas.filter((vistoria) => vistoria.status.toLowerCase() === statusFiltro.toLowerCase());
    }

    setVistoriasFiltradas(filtradas);
  };

  const formatarDataHoraParaBrasil = (dataISO) => {
    if (!dataISO) {
      return 'Não Concluída';
    }
    const data = new Date(dataISO);
    // Ajuste de fuso horário se necessário
    data.setHours(data.getHours() - 3);
    return data.toLocaleString('pt-BR', { timeZone: 'UTC' });
  };

  const handleMudancaPagina = (event, newPage) => {
    setPage(newPage);
  };

  const handleMudancaLinhasPorPagina = (event) => {
    const novasLinhas = parseInt(event.target.value, 10);
    setRowsPerPage(novasLinhas);
    setPage(0);
  };

  const handleNovaVistoria = () => {
    setModalCriarOpen(true);
  };

  const handleFecharModalCriar = () => {
    setModalCriarOpen(false);
  };

  const handleEditarVistoria = (vistoria) => {
    setVistoriaSelecionada(vistoria);
    setModalEditarOpen(true);
  };

  const handleFecharModalEditar = () => {
    setVistoriaSelecionada(null);
    setModalEditarOpen(false);
  };

  const handleAbrirModalDetalhes = (vistoria) => {
    setVistoriaDetalhes(vistoria);
    setModalDetalhesOpen(true);
  };

  const handleFecharModalDetalhes = () => {
    setVistoriaDetalhes(null);
    setModalDetalhesOpen(false);
  };

  const atualizarListaVistorias = () => {
    buscarVistorias();
  };

  const handlePesquisaChange = (event) => {
    setPesquisa(event.target.value);
    setPage(0);
  };

  const handleStatusChange = (event) => {
    setStatusFiltro(event.target.value);
    setPage(0);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection((prevDirection) => (prevDirection === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
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
      case 'tipoVistoria':
        valorA = a.tipoVistoria.toLowerCase();
        valorB = b.tipoVistoria.toLowerCase();
        break;
      case 'status':
        valorA = a.status.toLowerCase();
        valorB = b.status.toLowerCase();
        break;
      case 'dataAgendamento':
        valorA = a.dataAgendamento ? new Date(a.dataAgendamento).getTime() : 0;
        valorB = b.dataAgendamento ? new Date(b.dataAgendamento).getTime() : 0;
        break;
      case 'dataHoraConclusao':
        valorA = a.dataHoraConclusao ? new Date(a.dataHoraConclusao).getTime() : 0;
        valorB = b.dataHoraConclusao ? new Date(b.dataHoraConclusao).getTime() : 0;
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

  const vistoriasOrdenadas = [...vistoriasFiltradas].sort(ordenarVistorias);

  return (
    <Box sx={{ padding: '20px' }}>
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
        <Button onClick={handleNovaVistoria} variant="contained" sx={{ width: { xs: '100%', sm: 'auto' } }}>
          Nova Vistoria
        </Button>
      </Box>
      <MainCard title="Vistorias">
        <Box
          sx={{
            overflowX: 'auto',
            '&::-webkit-scrollbar': { width: '0.4em' },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,.1)',
              borderRadius: '4px'
            }
          }}
        >
          <TableContainer>
            <Table sx={{ minWidth: { xs: '600px', sm: 'auto' } }}>
              <TableHead>
                <TableRow>
                  <TableCell sortDirection={sortColumn === 'nomeCliente' ? sortDirection : false}>
                    <TableSortLabel
                      active={sortColumn === 'nomeCliente'}
                      direction={sortColumn === 'nomeCliente' ? sortDirection : 'asc'}
                      onClick={() => handleSort('nomeCliente')}
                    >
                      Cliente
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={sortColumn === 'tipoVistoria' ? sortDirection : false}>
                    <TableSortLabel
                      active={sortColumn === 'tipoVistoria'}
                      direction={sortColumn === 'tipoVistoria' ? sortDirection : 'asc'}
                      onClick={() => handleSort('tipoVistoria')}
                    >
                      Tipo de Vistoria
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={sortColumn === 'status' ? sortDirection : false}>
                    <div>
                      <FormControl sx={{ width: 100 }}>
                        <InputLabel>Status</InputLabel>
                        <Select value={statusFiltro} onChange={handleStatusChange} label="Status">
                          <MenuItem value="">Todos</MenuItem>
                          <MenuItem value="a vistoriar">A Vistoriar</MenuItem>
                          <MenuItem value="cancelado">Cancelado</MenuItem>
                          <MenuItem value="pendente de agendamento">Pendente de Agendamento</MenuItem>
                          <MenuItem value="correcao de instalacao">Correcao de Instalacao</MenuItem>
                          <MenuItem value="vistoriado">Vistoriado</MenuItem>
                        </Select>
                      </FormControl>
                      <TableSortLabel
                        active={sortColumn === 'status'}
                        direction={sortColumn === 'status' ? sortDirection : 'asc'}
                        onClick={() => handleSort('status')}
                      ></TableSortLabel>
                    </div>
                  </TableCell>
                  <TableCell sortDirection={sortColumn === 'dataAgendamento' ? sortDirection : false}>
                    <TableSortLabel
                      active={sortColumn === 'dataAgendamento'}
                      direction={sortColumn === 'dataAgendamento' ? sortDirection : 'asc'}
                      onClick={() => handleSort('dataAgendamento')}
                    >
                      Data de Agendamento
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={sortColumn === 'dataHoraConclusao' ? sortDirection : false}>
                    <TableSortLabel
                      active={sortColumn === 'dataHoraConclusao'}
                      direction={sortColumn === 'dataHoraConclusao' ? sortDirection : 'asc'}
                      onClick={() => handleSort('dataHoraConclusao')}
                    >
                      Data de Conclusão
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vistoriasOrdenadas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((vistoria) => (
                  <TableRow key={vistoria.id}>
                    <TableCell>{vistoria.nomeCliente}</TableCell>
                    <TableCell>{vistoria.tipoVistoria}</TableCell>
                    <TableCell>
                      <Chip
                        label={vistoria.status
                          .toString()
                          .toLowerCase()
                          .split(' ')
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ')}
                        sx={{
                          backgroundColor:
                            vistoria.status === 'a vistoriar'
                              ? '#2196F3'
                              : vistoria.status === 'cancelado'
                                ? '#9E9E9E'
                                : vistoria.status === 'pendente de agendamento'
                                  ? '#FFEB3B'
                                  : vistoria.status === 'correcao de instalacao'
                                    ? '#F44336'
                                    : vistoria.status === 'vistoriado'
                                      ? '#4CAF50'
                                      : '#E0E0E0',
                          color: vistoria.status === 'pendente de agendamento' ? '#000000FF' : 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {vistoria.dataAgendamento === null ? 'Não Concluída' : formatarDataHoraParaBrasil(vistoria.dataAgendamento)}
                    </TableCell>
                    <TableCell>
                      {vistoria.dataHoraConclusao === null ? 'Não Concluída' : formatarDataHoraParaBrasil(vistoria.dataHoraConclusao)}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Editar">
                        <IconButton onClick={() => handleEditarVistoria(vistoria)}>
                          <EditOutlined />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Ver Galeria">
                        <IconButton component={Link} to={`/admin/galeria/${vistoria.id}`}>
                          <PictureOutlined />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Ver Detalhes">
                        <IconButton onClick={() => handleAbrirModalDetalhes(vistoria)}>
                          <EyeOutlined />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15, 100, 200, 500, 1000]}
            component="div"
            count={vistoriasOrdenadas.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleMudancaPagina}
            onRowsPerPageChange={handleMudancaLinhasPorPagina}
            labelRowsPerPage="Linhas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`}
          />
        </Box>
      </MainCard>
      <CriarVistoria open={modalCriarOpen} onClose={handleFecharModalCriar} onSuccess={atualizarListaVistorias} />
      <EditarVistoria
        open={modalEditarOpen}
        onClose={handleFecharModalEditar}
        onSuccess={atualizarListaVistorias}
        vistoria={vistoriaSelecionada}
      />
      <VerDetalhesVistoria open={modalDetalhesOpen} onClose={handleFecharModalDetalhes} vistoria={vistoriaDetalhes} />
    </Box>
  );
};

export default Vistorias;
