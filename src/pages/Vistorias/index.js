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
  Tooltip
} from '@mui/material';
import { EditOutlined, PictureOutlined } from '@ant-design/icons';
import MainCard from 'components/sistema/MainCard';
import CriarVistoria from './components/criarVistoria';
import EditarVistoria from './components/editarVistoria';
import { api } from 'services/api';
import { Link } from 'react-router-dom';
import { notification } from 'components/notification/index';

const Vistorias = () => {
  const [vistorias, setVistorias] = useState([]);
  const [vistoriasFiltradas, setVistoriasFiltradas] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [pesquisa, setPesquisa] = useState('');
  const [modalCriarOpen, setModalCriarOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [vistoriaSelecionada, setVistoriaSelecionada] = useState(null);

  useEffect(() => {
    buscarVistorias();
  }, []);

  useEffect(() => {
    filtrarVistorias();
  }, [pesquisa, vistorias]);

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
    const filtradas = vistorias.filter((vistoria) => vistoria.nomeCliente.toLowerCase().includes(pesquisa.toLowerCase()));
    setVistoriasFiltradas(filtradas);
  };

  const formatarDataHoraParaBrasil = (dataISO) => {
    const data = new Date(dataISO);
    data.setHours(data.getHours() - 3);
    return data.toLocaleString('pt-BR', { timeZone: 'UTC' });
  };

  const handleMudancaPagina = (event, novaPagina) => {
    setPage(novaPagina);
  };

  const handleMudancaLinhasPorPagina = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
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

  const atualizarListaVistorias = () => {
    buscarVistorias();
  };

  const handlePesquisaChange = (event) => {
    setPesquisa(event.target.value);
    setPage(0);
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
                  <TableCell>Cliente</TableCell>
                  <TableCell>Tipo de Vistoria</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Data de Agendamento</TableCell>
                  <TableCell>Data de Conclusao</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vistoriasFiltradas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((vistoria) => (
                  <TableRow key={vistoria.id}>
                    <TableCell>{vistoria.nomeCliente}</TableCell>
                    <TableCell>{vistoria.tipoVistoria}</TableCell>
                    <TableCell>
                      <Chip
                        label={vistoria.status}
                        sx={{
                          backgroundColor:
                            vistoria.status === 'a vistoriar'
                              ? '#2196F3'
                              : vistoria.status === 'cancelado'
                                ? '#9E9E9E'
                                : vistoria.status === 'pendente'
                                  ? '#FF9800'
                                  : vistoria.status === 'correcao de instalacao'
                                    ? '#9C27B0'
                                    : '#E0E0E0',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {vistoria.dataAgendamento === null ? 'Não concluída' : formatarDataHoraParaBrasil(vistoria.dataAgendamento)}
                    </TableCell>
                    <TableCell>
                      {vistoria.dataHoraConclusao === null ? 'Não concluída' : formatarDataHoraParaBrasil(vistoria.dataHoraConclusao)}
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            component="div"
            count={vistoriasFiltradas.length}
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
    </Box>
  );
};

export default Vistorias;
