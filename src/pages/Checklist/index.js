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
import CriarChecklist from './components/criarChecklist';
import EditarChecklist from './components/editarChecklist';
import { api } from 'services/api';

const Checklist = () => {
  const [checklists, setChecklists] = useState([]);
  const [checklistsFiltrados, setChecklistsFiltrados] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [pesquisa, setPesquisa] = useState('');
  const [modalCriarOpen, setModalCriarOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [checklistSelecionado, setChecklistSelecionado] = useState(null);

  useEffect(() => {
    buscarChecklists();
  }, []);

  useEffect(() => {
    filtrarChecklists();
  }, [pesquisa, checklists]);

  const buscarChecklists = async () => {
    try {
      const response = await api.get('/checklist');
      setChecklists(response.data);
      setChecklistsFiltrados(response.data);
    } catch (error) {
      console.error('Erro ao buscar checklists:', error);
    }
  };

  const filtrarChecklists = () => {
    const filtrados = checklists.filter((checklist) => checklist.item.toLowerCase().includes(pesquisa.toLowerCase()));
    setChecklistsFiltrados(filtrados);
  };

  const formatarDataHoraParaBrasil = (dataISO) => {
    const data = new Date(dataISO);
    return data.toLocaleString('pt-BR', { timeZone: 'UTC' });
  };

  const handleMudancaPagina = (event, novaPagina) => {
    setPage(novaPagina);
  };

  const handleMudancaLinhasPorPagina = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleNovoChecklist = () => {
    setModalCriarOpen(true);
  };

  const handleFecharModalCriar = () => {
    setModalCriarOpen(false);
  };

  const handleEditarChecklist = (checklist) => {
    setChecklistSelecionado(checklist);
    setModalEditarOpen(true);
  };

  const handleFecharModalEditar = () => {
    setChecklistSelecionado(null);
    setModalEditarOpen(false);
  };

  const atualizarListaChecklists = () => {
    buscarChecklists();
  };

  const handlePesquisaChange = (event) => {
    setPesquisa(event.target.value);
    setPage(0);
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px' }}>
        <TextField label="Pesquisar por item" variant="outlined" value={pesquisa} onChange={handlePesquisaChange} sx={{ width: '300px' }} />
        <Button onClick={handleNovoChecklist} variant="contained">
          Novo Checklist
        </Button>
      </Box>
      <MainCard title="Checklists">
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
                  <TableCell>Item</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Data de Criação</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {checklistsFiltrados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((checklist) => (
                  <TableRow key={checklist.id}>
                    <TableCell>{checklist.item}</TableCell>
                    <TableCell>{checklist.tipo === 'cliente' ? 'Cliente' : 'Rede'}</TableCell>
                    <TableCell>
                      <Chip
                        label={checklist.status ? 'Ativo' : 'Inativo'}
                        sx={{
                          backgroundColor: checklist.status ? 'green' : 'red',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>
                    <TableCell>{formatarDataHoraParaBrasil(checklist.createdAt)}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditarChecklist(checklist)}>
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
            count={checklistsFiltrados.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleMudancaPagina}
            onRowsPerPageChange={handleMudancaLinhasPorPagina}
            labelRowsPerPage="Linhas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`}
          />
        </Box>
      </MainCard>
      <CriarChecklist open={modalCriarOpen} onClose={handleFecharModalCriar} onSuccess={atualizarListaChecklists} />
      <EditarChecklist
        open={modalEditarOpen}
        onClose={handleFecharModalEditar}
        onSuccess={atualizarListaChecklists}
        checklist={checklistSelecionado}
      />
    </Box>
  );
};

export default Checklist;
