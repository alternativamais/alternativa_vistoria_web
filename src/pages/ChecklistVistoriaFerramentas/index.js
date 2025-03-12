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
  TextField,
  IconButton,
  Tooltip
} from '@mui/material';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import MainCard from 'components/sistema/MainCard';
import { api } from 'services/api';
import { notification } from 'components/notification';
import CriarChecklistVistoriaFerramentas from './components/CriarChecklistVistoriaFerramentas';
import EditarChecklistVistoriaFerramentas from './components/EditarChecklistVistoriaFerramentas';

const ChecklistVistoriaFerramentas = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [pesquisa, setPesquisa] = useState('');
  const [modalCriarOpen, setModalCriarOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [checklistSelecionado, setChecklistSelecionado] = useState(null);
  const [checklists, setChecklists] = useState([]);
  const [checklistsFiltrados, setChecklistsFiltrados] = useState([]);

  const buscarChecklists = async () => {
    try {
      const response = await api.get('/checklist-vistoria-ferramentas');
      setChecklists(response.data);
      setChecklistsFiltrados(response.data);
    } catch (error) {
      notification({ message: 'Erro ao buscar checklists!', type: 'error' });
    }
  };

  useEffect(() => {
    buscarChecklists();
  }, []);

  useEffect(() => {
    const filtrados = checklists.filter((item) => item.nome.toLowerCase().includes(pesquisa.toLowerCase()));
    setChecklistsFiltrados(filtrados);
  }, [pesquisa, checklists]);

  const handlePesquisaChange = (event) => {
    setPesquisa(event.target.value);
    setPage(0);
  };

  const handleMudancaPagina = (event, newPage) => {
    setPage(newPage);
  };

  const handleMudancaLinhasPorPagina = (event) => {
    const novasLinhas = parseInt(event.target.value, 10);
    setRowsPerPage(novasLinhas);
    setPage(0);
  };

  const formatarData = (dataISO) => {
    if (!dataISO) return 'Sem data';
    const data = new Date(dataISO);
    data.setHours(data.getHours() - 3);
    return data.toLocaleDateString('pt-BR');
  };

  const handleDeletarChecklist = async (item) => {
    if (window.confirm('Deseja realmente deletar este checklist?')) {
      try {
        await api.delete(`/checklist-vistoria-ferramentas/${item.id}`);
        notification({ message: 'Checklist deletado com sucesso!', type: 'success' });
        buscarChecklists();
      } catch (error) {
        notification({ message: 'Erro ao deletar checklist!', type: 'error' });
      }
    }
  };

  const handleAbrirCriarModal = () => {
    setModalCriarOpen(true);
  };

  const handleFecharCriarModal = () => {
    setModalCriarOpen(false);
  };

  const handleAbrirEditarModal = (checklist) => {
    setChecklistSelecionado(checklist);
    setModalEditarOpen(true);
  };

  const handleFecharEditarModal = () => {
    setChecklistSelecionado(null);
    setModalEditarOpen(false);
  };

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
        <TextField label="Pesquisar por Nome" variant="outlined" value={pesquisa} onChange={handlePesquisaChange} sx={{ width: '300px' }} />
        <Button variant="contained" sx={{ width: { xs: '100%', sm: 'auto' } }} onClick={handleAbrirCriarModal}>
          Novo Checklist
        </Button>
      </Box>

      <MainCard title="Checklist Vistoria Ferramentas">
        <Box
          sx={{
            overflowX: 'auto',
            '&::-webkit-scrollbar': { width: '0.4em' },
            '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,.1)', borderRadius: '4px' }
          }}
        >
          <TableContainer>
            <Table sx={{ minWidth: 600 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Data de Criação</TableCell>
                  <TableCell>Data de Atualização</TableCell>
                  <TableCell>Qtd. de Itens</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {checklistsFiltrados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.nome}</TableCell>
                    <TableCell>{formatarData(item.createdAt)}</TableCell>
                    <TableCell>{formatarData(item.updatedAt)}</TableCell>
                    <TableCell>{item.items ? item.items.length : 0}</TableCell>
                    <TableCell>
                      <Tooltip title="Editar">
                        <IconButton onClick={() => handleAbrirEditarModal(item)}>
                          <EditOutlined />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Deletar">
                        <IconButton onClick={() => handleDeletarChecklist(item)}>
                          <DeleteOutlined />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 15, 100]}
              component="div"
              count={checklistsFiltrados.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleMudancaPagina}
              onRowsPerPageChange={handleMudancaLinhasPorPagina}
              labelRowsPerPage="Linhas por página:"
            />
          </Box>
        </Box>
      </MainCard>
      <CriarChecklistVistoriaFerramentas open={modalCriarOpen} onClose={handleFecharCriarModal} onSuccess={buscarChecklists} />
      <EditarChecklistVistoriaFerramentas
        open={modalEditarOpen}
        onClose={handleFecharEditarModal}
        onSuccess={buscarChecklists}
        checklist={checklistSelecionado}
      />
    </Box>
  );
};

export default ChecklistVistoriaFerramentas;
