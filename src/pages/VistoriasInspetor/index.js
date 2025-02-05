/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  IconButton,
  Tooltip,
  TableSortLabel,
  Typography
} from '@mui/material';
import { EditOutlined } from '@ant-design/icons';
import MainCard from 'components/sistema/MainCard';
import EditarVistoria from './components/editarVistoria';
import { api } from 'services/api';
import { notification } from 'components/notification/index';
import { useAuth } from 'hooks/auth';

const VistoriasInspetor = () => {
  const { user } = useAuth();

  const [page, setPage] = useState(() => {
    const paginaSalva = localStorage.getItem('paginaVistoriasInsp');
    return paginaSalva ? parseInt(paginaSalva, 10) : 0;
  });

  const [rowsPerPage, setRowsPerPage] = useState(() => {
    const linhasSalvas = localStorage.getItem('linhasPorPaginaVistoriasInsp');
    return linhasSalvas ? parseInt(linhasSalvas, 10) : 5;
  });

  const [pesquisa, setPesquisa] = useState(() => {
    const pesquisaSalva = localStorage.getItem('pesquisaVistoriasInsp');
    return pesquisaSalva ? pesquisaSalva : '';
  });

  const [sortColumn, setSortColumn] = useState(() => {
    const colunaSalva = localStorage.getItem('sortColumnVistoriasInsp');
    return colunaSalva ? colunaSalva : null;
  });

  const [sortDirection, setSortDirection] = useState(() => {
    const direcaoSalva = localStorage.getItem('sortDirectionVistoriasInsp');
    return direcaoSalva ? direcaoSalva : 'asc';
  });

  const [vistorias, setVistorias] = useState([]);
  const [vistoriasFiltradas, setVistoriasFiltradas] = useState([]);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [vistoriaSelecionada, setVistoriaSelecionada] = useState(null);

  useEffect(() => {
    buscarVistorias();
  }, []);

  useEffect(() => {
    filtrarVistorias();
  }, [pesquisa, vistorias]);

  useEffect(() => {
    localStorage.setItem('paginaVistoriasInsp', page.toString());
  }, [page]);

  useEffect(() => {
    localStorage.setItem('linhasPorPaginaVistoriasInsp', rowsPerPage.toString());
  }, [rowsPerPage]);

  useEffect(() => {
    localStorage.setItem('pesquisaVistoriasInsp', pesquisa);
  }, [pesquisa]);

  useEffect(() => {
    if (sortColumn !== null) {
      localStorage.setItem('sortColumnVistoriasInsp', sortColumn);
    }
  }, [sortColumn]);

  useEffect(() => {
    if (sortDirection !== null) {
      localStorage.setItem('sortDirectionVistoriasInsp', sortDirection);
    }
  }, [sortDirection]);

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
    let filtradas = [...vistorias];

    if (pesquisa.trim() !== '') {
      filtradas = filtradas.filter((vistoria) => vistoria.nomeCliente.toLowerCase().includes(pesquisa.toLowerCase()));
    }

    setVistoriasFiltradas(filtradas);
  };

  const formatarDataHoraParaBrasil = (dataISO) => {
    if (!dataISO) return 'Não Concluída';
    const data = new Date(dataISO);
    return data.toLocaleString('pt-BR');
  };

  const handleMudancaPagina = (event, newPage) => {
    setPage(newPage);
  };

  const handleMudancaLinhasPorPagina = (event) => {
    const novasLinhas = parseInt(event.target.value, 10);
    setRowsPerPage(novasLinhas);
    setPage(0);
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

  const vistoriasOrdenadas = [...vistoriasFiltradas].sort(ordenarVistorias);

  return (
    <Box sx={{ padding: '20px' }}>
      {/* Barra de pesquisa */}
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
            <Table>
              <TableHead>
                <TableRow>
                  {/* Cliente */}
                  <TableCell sortDirection={sortColumn === 'nomeCliente' ? sortDirection : false}>
                    <TableSortLabel
                      active={sortColumn === 'nomeCliente'}
                      direction={sortColumn === 'nomeCliente' ? sortDirection : 'asc'}
                      onClick={() => handleSort('nomeCliente')}
                    >
                      Cliente
                    </TableSortLabel>
                  </TableCell>

                  {/* Tipo de Vistoria */}
                  <TableCell sortDirection={sortColumn === 'tipoVistoria' ? sortDirection : false}>
                    <TableSortLabel
                      active={sortColumn === 'tipoVistoria'}
                      direction={sortColumn === 'tipoVistoria' ? sortDirection : 'asc'}
                      onClick={() => handleSort('tipoVistoria')}
                    >
                      Tipo de Vistoria
                    </TableSortLabel>
                  </TableCell>

                  {/* Exibimos a coluna "Status" sem qualquer verificação extra */}
                  <TableCell>Status</TableCell>

                  {/* Data de Agendamento */}
                  <TableCell sortDirection={sortColumn === 'dataAgendamento' ? sortDirection : false}>
                    <TableSortLabel
                      active={sortColumn === 'dataAgendamento'}
                      direction={sortColumn === 'dataAgendamento' ? sortDirection : 'asc'}
                      onClick={() => handleSort('dataAgendamento')}
                    >
                      Data de Agendamento
                    </TableSortLabel>
                  </TableCell>

                  {/* Ações */}
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {vistoriasOrdenadas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((vistoria) => (
                  <TableRow key={vistoria.id}>
                    {/* Cliente */}
                    <TableCell>
                      <Typography>{vistoria.nomeCliente}</Typography>
                    </TableCell>

                    {/* Tipo de Vistoria */}
                    <TableCell>{vistoria.tipoVistoria}</TableCell>

                    {/* Status (será sempre "a vistoriar" vindo do backend) */}
                    <TableCell>
                      <Typography>{vistoria.status}</Typography>
                    </TableCell>

                    {/* Data de Agendamento */}
                    <TableCell>
                      {vistoria.dataAgendamento ? formatarDataHoraParaBrasil(vistoria.dataAgendamento) : 'Pendente de Agendamento'}
                    </TableCell>

                    {/* Ações */}
                    <TableCell>
                      <Tooltip title="Editar">
                        <IconButton onClick={() => handleEditarVistoria(vistoria)}>
                          <EditOutlined />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Paginação */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 15, 25, 50, 100]}
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
