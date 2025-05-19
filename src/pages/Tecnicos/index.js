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
  Tooltip,
  Chip,
  Collapse,
  Typography,
  Divider
} from '@mui/material';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import MainCard from 'components/sistema/MainCard';
import { api } from 'services/api';
import { notification } from 'components/notification';

import CriarTecnico from './components/CriarTecnico';
import EditarTecnico from './components/EditarTecnico';
import VerDetalhesTecnico from './components/VerDetalhesTecnico';

const Tecnicos = () => {
  const [page, setPage] = useState(() => {
    const saved = localStorage.getItem('paginaTecnicos');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    const saved = localStorage.getItem('linhasPorPaginaTecnicos');
    return saved ? parseInt(saved, 10) : 5;
  });
  const [pesquisa, setPesquisa] = useState(() => {
    const saved = localStorage.getItem('pesquisaTecnicos');
    return saved || '';
  });

  const [tecnicos, setTecnicos] = useState([]);
  const [tecnicosFiltrados, setTecnicosFiltrados] = useState([]);
  const [modalCriarOpen, setModalCriarOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [modalDetalhesOpen, setModalDetalhesOpen] = useState(false);
  const [tecnicoSelecionado, setTecnicoSelecionado] = useState(null);
  const [tecnicoDetalhes, setTecnicoDetalhes] = useState(null);
  const [mostrarCancelados, setMostrarCancelados] = useState(false);

  const buscarTecnicos = async () => {
    try {
      const { data } = await api.get('/tecnicos');
      setTecnicos(data);
      setTecnicosFiltrados(data);
    } catch {
      notification({ message: 'Erro ao buscar técnicos!', type: 'error' });
    }
  };

  useEffect(() => {
    buscarTecnicos();
  }, []);

  useEffect(() => {
    const filtrados = tecnicos.filter((t) => t.nome.toLowerCase().includes(pesquisa.toLowerCase()));
    setTecnicosFiltrados(filtrados);
  }, [pesquisa, tecnicos]);

  useEffect(() => {
    localStorage.setItem('paginaTecnicos', page.toString());
  }, [page]);
  useEffect(() => {
    localStorage.setItem('linhasPorPaginaTecnicos', rowsPerPage.toString());
  }, [rowsPerPage]);
  useEffect(() => {
    localStorage.setItem('pesquisaTecnicos', pesquisa);
  }, [pesquisa]);

  const tecnicosAtivos = tecnicosFiltrados.filter((t) => t.status !== 'Cancelado');
  const tecnicosCancelados = tecnicosFiltrados.filter((t) => t.status === 'Cancelado');

  const handleDeletarTecnico = async (t) => {
    if (window.confirm('Deseja realmente cancelar este técnico?')) {
      try {
        await api.delete(`/tecnicos/${t.id}`);
        notification({ message: 'Técnico cancelado com sucesso!', type: 'success' });
        buscarTecnicos();
      } catch {
        notification({ message: 'Erro ao cancelar técnico!', type: 'error' });
      }
    }
  };

  const handleNovaCriacao = () => setModalCriarOpen(true);
  const handleFecharModalCriar = () => setModalCriarOpen(false);
  const handleEditarTecnico = (t) => {
    setTecnicoSelecionado(t);
    setModalEditarOpen(true);
  };
  const handleFecharModalEditar = () => {
    setTecnicoSelecionado(null);
    setModalEditarOpen(false);
  };
  const handleDetalhesTecnico = (t) => {
    setTecnicoDetalhes(t);
    setModalDetalhesOpen(true);
  };
  const handleFecharModalDetalhes = () => {
    setTecnicoDetalhes(null);
    setModalDetalhesOpen(false);
  };

  const handlePesquisaChange = (e) => {
    setPesquisa(e.target.value);
    setPage(0);
  };
  const handleMudancaPagina = (_, newPage) => setPage(newPage);
  const handleMudancaLinhasPorPagina = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const toggleMostrarCancelados = () => setMostrarCancelados((v) => !v);

  const formatarValor = (v) => `R$ ${parseFloat(v).toFixed(2)}`;

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          pb: 1
        }}
      >
        <TextField label="Pesquisar por Nome" variant="outlined" value={pesquisa} onChange={handlePesquisaChange} sx={{ width: 300 }} />
        <Button onClick={handleNovaCriacao} variant="contained">
          Novo Técnico
        </Button>
      </Box>

      <MainCard title="Técnicos Ativos">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Status</TableCell>
                <TableCell># Ferramentas</TableCell>
                <TableCell>Valor Total</TableCell>
                <TableCell>Valor Devido</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tecnicosAtivos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => {
                const todasTags = item.ferramentas.flatMap((f) => f.tags || []);
                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.nome}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.status === 'Cancelado' ? 'Cancelado' : 'Ativo'}
                        size="small"
                        color={item.status === 'Cancelado' ? 'error' : 'success'}
                      />
                    </TableCell>
                    <TableCell>{item.ferramentas.length}</TableCell>
                    <TableCell>{formatarValor(item.totalFerramentasOriginal)}</TableCell>
                    <TableCell>
                      {item.totalPerdido > 0 && (
                        <Box component="span" sx={{ color: 'red' }}>
                          (Perdido: {formatarValor(item.totalPerdido)})
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      {todasTags.length > 0
                        ? todasTags.map((tag, i) => <Chip key={i} label={tag.tags || tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />)
                        : 'Nenhuma'}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Editar">
                        <IconButton onClick={() => handleEditarTecnico(item)}>
                          <EditOutlined />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Cancelar">
                        <IconButton onClick={() => handleDeletarTecnico(item)}>
                          <DeleteOutlined />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Ver Detalhes">
                        <IconButton onClick={() => handleDetalhesTecnico(item)}>
                          <EyeOutlined />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15, 100]}
            component="div"
            count={tecnicosAtivos.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleMudancaPagina}
            onRowsPerPageChange={handleMudancaLinhasPorPagina}
            labelRowsPerPage="Linhas por página:"
          />
        </Box>
      </MainCard>

      <Box sx={{ mt: 3 }}>
        <Divider sx={{ mb: 1 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={toggleMostrarCancelados}>
          <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
            Técnicos Cancelados ({tecnicosCancelados.length})
          </Typography>
          <Chip label={mostrarCancelados ? 'Ocultar' : 'Exibir'} size="small" />
        </Box>
        <Collapse in={mostrarCancelados}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell># Ferramentas</TableCell>
                  <TableCell>Valor Total</TableCell>
                  <TableCell>Valor Devido</TableCell>
                  <TableCell>Tags</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tecnicosCancelados.map((item) => {
                  const todasTags = item.ferramentas.flatMap((f) => f.tags || []);
                  return (
                    <TableRow key={item.id}>
                      <TableCell>{item.nome}</TableCell>
                      <TableCell>
                        <Chip label="Cancelado" size="small" color="error" />
                      </TableCell>
                      <TableCell>{item.ferramentas.length}</TableCell>
                      <TableCell>{formatarValor(item.totalFerramentasOriginal)}</TableCell>
                      <TableCell>
                        {item.totalPerdido > 0 && (
                          <Box component="span" sx={{ color: 'red' }}>
                            (Perdido: {formatarValor(item.totalPerdido)})
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        {todasTags.length > 0
                          ? todasTags.map((tag, i) => <Chip key={i} label={tag.tags || tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />)
                          : 'Nenhuma'}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Ver Detalhes">
                          <IconButton onClick={() => handleDetalhesTecnico(item)}>
                            <EyeOutlined />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Collapse>
      </Box>

      <CriarTecnico open={modalCriarOpen} onClose={handleFecharModalCriar} onSuccess={buscarTecnicos} />
      <EditarTecnico open={modalEditarOpen} onClose={handleFecharModalEditar} onSuccess={buscarTecnicos} tecnico={tecnicoSelecionado} />
      <VerDetalhesTecnico open={modalDetalhesOpen} onClose={handleFecharModalDetalhes} tecnico={tecnicoDetalhes} />
    </Box>
  );
};

export default Tecnicos;
