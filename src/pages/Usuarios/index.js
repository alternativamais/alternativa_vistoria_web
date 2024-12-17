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
import CriarUsuario from './components/criarUsuario';
import EditarUsuario from './components/editarUsuario';
import { api } from 'services/api';
import { notification } from 'components/notification/index';

const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [pesquisa, setPesquisa] = useState('');
  const [modalCriarOpen, setModalCriarOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);

  useEffect(() => {
    buscarUsuarios();
  }, []);

  useEffect(() => {
    filtrarUsuarios();
  }, [pesquisa, usuarios]);

  const buscarUsuarios = async () => {
    try {
      const response = await api.get('/users');
      setUsuarios(response.data);
      setUsuariosFiltrados(response.data);
    } catch (error) {
      notification({ message: 'Erro ao buscar usuários!', type: 'error' });
    }
  };

  const filtrarUsuarios = () => {
    const filtrados = usuarios.filter((usuario) => usuario.name.toLowerCase().includes(pesquisa.toLowerCase()));
    setUsuariosFiltrados(filtrados);
  };

  const formatarDataParaBrasil = (dataISO) => {
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const handleMudancaPagina = (event, novaPagina) => {
    setPage(novaPagina);
  };

  const handleMudancaLinhasPorPagina = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleNovoUsuario = () => {
    setModalCriarOpen(true);
  };

  const handleFecharModalCriar = () => {
    setModalCriarOpen(false);
  };

  const handleEditarUsuario = (usuario) => {
    setUsuarioSelecionado(usuario);
    setModalEditarOpen(true);
  };

  const handleFecharModalEditar = () => {
    setUsuarioSelecionado(null);
    setModalEditarOpen(false);
  };

  const atualizarListaUsuarios = () => {
    buscarUsuarios();
  };

  const handlePesquisaChange = (event) => {
    setPesquisa(event.target.value);
    setPage(0);
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px' }}>
        <TextField label="Pesquisar por nome" variant="outlined" value={pesquisa} onChange={handlePesquisaChange} sx={{ width: '300px' }} />
        <Button onClick={handleNovoUsuario} variant="contained">
          Novo usuário
        </Button>
      </Box>
      <MainCard title="Usuários">
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
                  <TableCell>Nome</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Data de Nascimento</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usuariosFiltrados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell>{usuario.name}</TableCell>
                    <TableCell>{usuario.username}</TableCell>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>{formatarDataParaBrasil(usuario.birthday)}</TableCell>
                    <TableCell>
                      <Chip
                        label={usuario.status === 'active' ? 'Ativo' : 'Inativo'}
                        sx={{
                          backgroundColor: usuario.status === 'active' ? 'green' : 'gray',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditarUsuario(usuario)}>
                        <EditOutlined />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15, 100, 200, 500, 1000]}
            component="div"
            count={usuariosFiltrados.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleMudancaPagina}
            onRowsPerPageChange={handleMudancaLinhasPorPagina}
            labelRowsPerPage="Linhas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`}
          />
        </Box>
      </MainCard>
      <CriarUsuario open={modalCriarOpen} onClose={handleFecharModalCriar} onSuccess={atualizarListaUsuarios} />
      <EditarUsuario
        open={modalEditarOpen}
        onClose={handleFecharModalEditar}
        onSuccess={atualizarListaUsuarios}
        usuario={usuarioSelecionado}
      />
    </Box>
  );
};

export default ListaUsuarios;
