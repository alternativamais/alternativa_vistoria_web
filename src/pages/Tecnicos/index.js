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
  // Estados de paginação e pesquisa
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

  // Lista de técnicos
  const [tecnicos, setTecnicos] = useState([]);
  const [tecnicosFiltrados, setTecnicosFiltrados] = useState([]);

  // Estados para controle dos modais
  const [modalCriarOpen, setModalCriarOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [modalDetalhesOpen, setModalDetalhesOpen] = useState(false);
  const [tecnicoSelecionado, setTecnicoSelecionado] = useState(null);
  const [tecnicoDetalhes, setTecnicoDetalhes] = useState(null);

  // Estado para controlar a exibição da seção de técnicos deletados
  const [mostrarDeletados, setMostrarDeletados] = useState(false);

  // Função para buscar técnicos
  const buscarTecnicos = async () => {
    try {
      // A API já retorna técnicos com "ferramentas" e "ferramentasDeletadas"
      const response = await api.get('/tecnicos');
      setTecnicos(response.data);
      setTecnicosFiltrados(response.data);
    } catch (error) {
      notification({ message: 'Erro ao buscar técnicos!', type: 'error' });
    }
  };

  useEffect(() => {
    buscarTecnicos();
  }, []);

  // Filtra os técnicos com base na pesquisa (buscando pelo nome)
  useEffect(() => {
    const filtrados = tecnicos.filter((item) => item.nome.toLowerCase().includes(pesquisa.toLowerCase()));
    setTecnicosFiltrados(filtrados);
  }, [pesquisa, tecnicos]);

  // Persistência dos estados de paginação e pesquisa
  useEffect(() => {
    localStorage.setItem('paginaTecnicos', page.toString());
  }, [page]);
  useEffect(() => {
    localStorage.setItem('linhasPorPaginaTecnicos', rowsPerPage.toString());
  }, [rowsPerPage]);
  useEffect(() => {
    localStorage.setItem('pesquisaTecnicos', pesquisa);
  }, [pesquisa]);

  // Separa os técnicos ativos e os deletados (considerando que um técnico deletado possui deletedAt definido)
  const tecnicosAtivos = tecnicosFiltrados.filter((item) => !item.deletedAt);
  const tecnicosDeletados = tecnicosFiltrados.filter((item) => item.deletedAt);

  // Handler para deletar técnico
  const handleDeletarTecnico = async (item) => {
    if (window.confirm('Deseja realmente deletar este técnico?')) {
      try {
        await api.delete(`/tecnicos/${item.id}`);
        notification({ message: 'Técnico deletado com sucesso!', type: 'success' });
        buscarTecnicos();
      } catch (error) {
        notification({ message: 'Erro ao deletar técnico!', type: 'error' });
      }
    }
  };

  // Handlers para abrir/fechar modais
  const handleNovaCriacao = () => {
    setModalCriarOpen(true);
  };

  const handleFecharModalCriar = () => {
    setModalCriarOpen(false);
  };

  const handleEditarTecnico = (item) => {
    setTecnicoSelecionado(item);
    setModalEditarOpen(true);
  };

  const handleFecharModalEditar = () => {
    setTecnicoSelecionado(null);
    setModalEditarOpen(false);
  };

  // Handlers para visualização dos detalhes do técnico
  const handleDetalhesTecnico = (item) => {
    setTecnicoDetalhes(item);
    setModalDetalhesOpen(true);
  };

  const handleFecharModalDetalhes = () => {
    setTecnicoDetalhes(null);
    setModalDetalhesOpen(false);
  };

  // Handlers de pesquisa e paginação
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

  // Função para alternar a exibição dos técnicos deletados
  const toggleMostrarDeletados = () => {
    setMostrarDeletados((prev) => !prev);
  };

  // Formata o valor para exibição como moeda
  const formatarValor = (valor) => {
    return `R$ ${parseFloat(valor).toFixed(2)}`;
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
        <Button onClick={handleNovaCriacao} variant="contained" sx={{ width: { xs: '100%', sm: 'auto' } }}>
          Novo Técnico
        </Button>
      </Box>

      <MainCard title="Técnicos">
        {/* Técnicos Ativos */}
        <TableContainer>
          <Table sx={{ minWidth: 600 }}>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Ferramentas Ativas</TableCell>
                <TableCell>Ferramentas Deletadas</TableCell>
                <TableCell>Valor Total</TableCell>
                <TableCell>Valor Devido Total</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tecnicosAtivos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => {
                // Contabiliza as tags de ambas as listas
                const todasTags = [
                  ...item.ferramentas.reduce((acc, ferramenta) => acc.concat(ferramenta.tags || []), []),
                  ...item.ferramentasDeletadas.reduce((acc, ferramenta) => acc.concat(ferramenta.tags || []), [])
                ];
                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.nome}</TableCell>
                    <TableCell>{item.ferramentas.length}</TableCell>
                    <TableCell>{item.ferramentasDeletadas.length}</TableCell>
                    <TableCell>{formatarValor(item.totalFerramentas || 0)}</TableCell>
                    <TableCell>
                      {item.totalPerdido > 0 && (
                        <Box component="span" sx={{ color: 'red' }}>
                          (Perdido: {formatarValor(item.totalPerdido)})
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      {todasTags.length > 0
                        ? todasTags.map((tag, index) => <Chip key={index} label={tag.tags || tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />)
                        : 'Nenhuma'}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Editar">
                        <IconButton onClick={() => handleEditarTecnico(item)}>
                          <EditOutlined />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Deletar">
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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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

        {/* Seção de Técnicos Deletados */}
        <Box sx={{ mt: 3 }}>
          <Divider sx={{ mb: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={toggleMostrarDeletados}>
            <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
              Técnicos Deletados ({tecnicosDeletados.length})
            </Typography>
            <Chip label={mostrarDeletados ? 'Ocultar' : 'Exibir'} size="small" />
          </Box>
          <Collapse in={mostrarDeletados}>
            <TableContainer>
              <Table sx={{ minWidth: 600 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>Ferramentas Ativas</TableCell>
                    <TableCell>Ferramentas Deletadas</TableCell>
                    <TableCell>Valor Total</TableCell>
                    <TableCell>Valor Devido Total</TableCell>
                    <TableCell>Tags</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tecnicosDeletados.map((item) => {
                    const todasTags = [
                      ...item.ferramentas.reduce((acc, ferramenta) => acc.concat(ferramenta.tags || []), []),
                      ...item.ferramentasDeletadas.reduce((acc, ferramenta) => acc.concat(ferramenta.tags || []), [])
                    ];
                    return (
                      <TableRow key={item.id}>
                        <TableCell>{item.nome}</TableCell>
                        <TableCell>{item.ferramentas.length}</TableCell>
                        <TableCell>{item.ferramentasDeletadas.length}</TableCell>
                        <TableCell>{formatarValor(item.totalFerramentas || 0)}</TableCell>
                        <TableCell>
                          {item.totalPerdido > 0 && (
                            <Box component="span" sx={{ color: 'red' }}>
                              (Perdido: {formatarValor(item.totalPerdido)})
                            </Box>
                          )}
                        </TableCell>
                        <TableCell>
                          {todasTags.length > 0
                            ? todasTags.map((tag, index) => (
                                <Chip key={index} label={tag.tags || tag} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                              ))
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
      </MainCard>

      <CriarTecnico open={modalCriarOpen} onClose={handleFecharModalCriar} onSuccess={buscarTecnicos} />
      <EditarTecnico open={modalEditarOpen} onClose={handleFecharModalEditar} onSuccess={buscarTecnicos} tecnico={tecnicoSelecionado} />
      <VerDetalhesTecnico open={modalDetalhesOpen} onClose={handleFecharModalDetalhes} tecnico={tecnicoDetalhes} />
    </Box>
  );
};

export default Tecnicos;
