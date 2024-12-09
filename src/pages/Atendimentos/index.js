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
  IconButton
} from '@mui/material';
import { EditOutlined } from '@ant-design/icons';
import MainCard from 'components/sistema/MainCard';
import CriarAtendimento from './components/CriarAtendimento';
import EditarAtendimento from './components/EditarAtendimento';
import { api } from 'services/api';
import { notification } from 'components/notification/index';

const Atendimentos = () => {
  const [atendimentos, setAtendimentos] = useState([]);
  const [atendimentosFiltrados, setAtendimentosFiltrados] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [pesquisa, setPesquisa] = useState('');
  const [modalCriarOpen, setModalCriarOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [atendimentoSelecionado, setAtendimentoSelecionado] = useState(null);

  useEffect(() => {
    buscarAtendimentos();
  }, []);

  useEffect(() => {
    filtrarAtendimentos();
  }, [pesquisa, atendimentos]);

  const buscarAtendimentos = async () => {
    try {
      const response = await api.get('/atendimentos');
      setAtendimentos(response.data);
      setAtendimentosFiltrados(response.data);
    } catch (error) {
      notification({ message: 'Erro ao buscar atendimentos!', type: 'error' });
    }
  };

  const filtrarAtendimentos = () => {
    const filtrados = atendimentos.filter((atendimento) => atendimento.observacao.toLowerCase().includes(pesquisa.toLowerCase()));
    setAtendimentosFiltrados(filtrados);
  };

  const handleMudancaPagina = (event, novaPagina) => {
    setPage(novaPagina);
  };

  const handleMudancaLinhasPorPagina = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleNovoAtendimento = () => {
    setModalCriarOpen(true);
  };

  const handleFecharModalCriar = () => {
    setModalCriarOpen(false);
  };

  const handleEditarAtendimento = (atendimento) => {
    setAtendimentoSelecionado(atendimento);
    setModalEditarOpen(true);
  };

  const handleFecharModalEditar = () => {
    setAtendimentoSelecionado(null);
    setModalEditarOpen(false);
  };

  const atualizarListaAtendimentos = () => {
    buscarAtendimentos();
  };

  const handlePesquisaChange = (event) => {
    setPesquisa(event.target.value);
    setPage(0);
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px' }}>
        <TextField
          label="Pesquisar por observação"
          variant="outlined"
          value={pesquisa}
          onChange={handlePesquisaChange}
          sx={{ width: '300px' }}
        />
        <Button onClick={handleNovoAtendimento} variant="contained">
          Novo Atendimento
        </Button>
      </Box>
      <MainCard title="Atendimentos">
        <Box
          sx={{
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
              width: '0.4em'
            },
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
                  <TableCell>Veículo ID</TableCell>
                  <TableCell>Vistoria ID</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>KM Saída</TableCell>
                  <TableCell>KM Chegada</TableCell>
                  <TableCell>Horário Saída</TableCell>
                  <TableCell>Horário Chegada</TableCell>
                  <TableCell>Observação</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {atendimentosFiltrados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((atendimento) => (
                  <TableRow key={atendimento.id}>
                    <TableCell>{atendimento.veiculoId}</TableCell>
                    <TableCell>{atendimento.vistoriaId}</TableCell>
                    <TableCell>
                      <Chip
                        label={atendimento.status}
                        sx={{
                          backgroundColor: atendimento.status === 'pendente' ? 'orange' : 'green',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>
                    <TableCell>{atendimento.kmSaida}</TableCell>
                    <TableCell>{atendimento.kmChegada}</TableCell>
                    <TableCell>{new Date(atendimento.horarioSaida).toLocaleString()}</TableCell>
                    <TableCell>{new Date(atendimento.horarioChegada).toLocaleString()}</TableCell>
                    <TableCell>{atendimento.observacao}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditarAtendimento(atendimento)}>
                        <EditOutlined />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            component="div"
            count={atendimentosFiltrados.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleMudancaPagina}
            onRowsPerPageChange={handleMudancaLinhasPorPagina}
            labelRowsPerPage="Linhas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`}
          />
        </Box>
      </MainCard>
      <CriarAtendimento open={modalCriarOpen} onClose={handleFecharModalCriar} onSuccess={atualizarListaAtendimentos} />
      <EditarAtendimento
        open={modalEditarOpen}
        onClose={handleFecharModalEditar}
        onSuccess={atualizarListaAtendimentos}
        atendimento={atendimentoSelecionado}
      />
    </Box>
  );
};

export default Atendimentos;
