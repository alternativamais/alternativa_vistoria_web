/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Chip,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { EditOutlined, DeleteOutlined, EyeOutlined, PictureOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import MainCard from 'components/sistema/MainCard';
import CriarVistoriaFerramentas from './components/CriarVistoriaFerramentas';
import EditarVistoriaFerramentas from './components/EditarVistoriaFerramentas';
import VerDetalhesVistoriaFerramentas from './components/VerDetalhesVistoriaFerramentas';
import { api } from 'services/api';
import { notification } from 'components/notification';

const VistoriasFerramentas = () => {
  // Estados de paginação e filtro
  const [page, setPage] = useState(() => {
    const saved = localStorage.getItem('paginaVistoriasFerramentas');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    const saved = localStorage.getItem('linhasPorPaginaVistoriasFerramentas');
    return saved ? parseInt(saved, 10) : 5;
  });
  const [pesquisa, setPesquisa] = useState(() => {
    const saved = localStorage.getItem('pesquisaVistoriasFerramentas');
    return saved || '';
  });
  const [statusFiltro, setStatusFiltro] = useState(() => {
    const saved = localStorage.getItem('statusFiltroVistoriasFerramentas');
    return saved || '';
  });

  // Estados de ordenação
  const [sortColumn, setSortColumn] = useState(() => {
    const saved = localStorage.getItem('sortColumnVistoriasFerramentas');
    return saved || 'data_vistoria';
  });
  const [sortDirection, setSortDirection] = useState(() => {
    const saved = localStorage.getItem('sortDirectionVistoriasFerramentas');
    return saved || 'asc';
  });

  // Lista de vistorias
  const [vistorias, setVistorias] = useState([]);
  const [vistoriasFiltradas, setVistoriasFiltradas] = useState([]);

  // Estados dos modais
  const [modalCriarOpen, setModalCriarOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [vistoriaSelecionada, setVistoriaSelecionada] = useState(null);

  // Novo estado para exibir modal de detalhes
  const [modalDetalhesOpen, setModalDetalhesOpen] = useState(false);
  const [vistoriaDetalhes, setVistoriaDetalhes] = useState(null);

  // Função para buscar os dados com filtro para não exibir os deletados
  const buscarVistorias = async () => {
    try {
      const response = await api.get('/vistoria-ferramentas');
      // Filtra as vistorias que não possuem deletedAt definido (ou seja, não deletadas)
      const dadosFiltrados = response.data.filter((item) => !item.vistoria.deletedAt);
      setVistorias(dadosFiltrados);
      setVistoriasFiltradas(dadosFiltrados);
    } catch (error) {
      notification({ message: 'Erro ao buscar vistorias de ferramentas!', type: 'error' });
    }
  };

  useEffect(() => {
    buscarVistorias();
  }, []);

  // Filtra as vistorias com base na pesquisa (buscando pelo nome do técnico ou data)
  // e também filtra pelo status, se definido
  useEffect(() => {
    let filtradas = [...vistorias];
    if (pesquisa.trim() !== '') {
      filtradas = filtradas.filter((item) => {
        const { tecnico_nome, data_vistoria } = item.vistoria;
        return tecnico_nome.toLowerCase().includes(pesquisa.toLowerCase()) || (data_vistoria && data_vistoria.includes(pesquisa));
      });
    }
    if (statusFiltro.trim() !== '') {
      filtradas = filtradas.filter((item) => item.vistoria.status.toLowerCase() === statusFiltro.toLowerCase());
    }
    setVistoriasFiltradas(filtradas);
  }, [pesquisa, statusFiltro, vistorias]);

  // Persistência dos estados
  useEffect(() => {
    localStorage.setItem('paginaVistoriasFerramentas', page.toString());
  }, [page]);
  useEffect(() => {
    localStorage.setItem('linhasPorPaginaVistoriasFerramentas', rowsPerPage.toString());
  }, [rowsPerPage]);
  useEffect(() => {
    localStorage.setItem('pesquisaVistoriasFerramentas', pesquisa);
  }, [pesquisa]);
  useEffect(() => {
    localStorage.setItem('statusFiltroVistoriasFerramentas', statusFiltro);
  }, [statusFiltro]);
  useEffect(() => {
    localStorage.setItem('sortColumnVistoriasFerramentas', sortColumn);
  }, [sortColumn]);
  useEffect(() => {
    localStorage.setItem('sortDirectionVistoriasFerramentas', sortDirection);
  }, [sortDirection]);

  // Ordenação dos registros
  const ordenarVistorias = (a, b) => {
    let valorA = '';
    let valorB = '';
    if (sortColumn === 'data_vistoria') {
      valorA = a.vistoria.data_vistoria;
      valorB = b.vistoria.data_vistoria;
    } else if (sortColumn === 'status') {
      valorA = a.vistoria.status.toLowerCase();
      valorB = b.vistoria.status.toLowerCase();
    }
    if (valorA < valorB) return sortDirection === 'asc' ? -1 : 1;
    if (valorA > valorB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  };

  const vistoriasOrdenadas = [...vistoriasFiltradas].sort(ordenarVistorias);

  // Renderiza as ferramentas, filtrando itens sem ferramenta ou com ferramenta deletada
  const renderFerramentas = (itens) => {
    const validItens = itens.filter((item) => item.ferramenta && !item.ferramenta.deletedAt);
    const nomes = [
      ...new Set(
        validItens.map((item) => {
          if (item.tecnicoFerramenta && item.tecnicoFerramenta.ferramenta) {
            return item.tecnicoFerramenta.ferramenta.nome;
          } else if (item.ferramenta) {
            return item.ferramenta.nome;
          }
          return null;
        })
      )
    ].filter((nome) => nome); // Remove valores nulos ou vazios

    if (nomes.length === 0) return <span>-</span>;
    if (nomes.length <= 2) {
      return <span>{nomes.join(', ')}</span>;
    }
    const firstTwo = nomes.slice(0, 2).join(', ');
    const restante = nomes.length - 2;
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <span>{firstTwo}</span>
        <Chip label={`+${restante}`} size="small" />
      </Box>
    );
  };

  // Renderiza o status com o Chip de diferenciação
  const renderStatus = (status) => (
    <Chip
      label={status
        .toString()
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')}
      sx={{
        backgroundColor:
          status === 'a vistoriar'
            ? '#2196F3'
            : status === 'cancelado'
              ? '#9E9E9E'
              : status === 'pendente de agendamento'
                ? '#FFEB3B'
                : status === 'vistoriado ok'
                  ? '#4CAF50'
                  : '#E0E0E0',
        color: status === 'pendente de agendamento' ? '#000000FF' : 'white',
        fontWeight: 'bold'
      }}
    />
  );

  // Handler para deletar vistoria
  const handleDeletarVistoria = async (item) => {
    if (window.confirm('Deseja realmente deletar esta vistoria?')) {
      try {
        await api.delete(`/vistoria-ferramentas/${item.vistoria.id}`);
        notification({ message: 'Vistoria deletada com sucesso!', type: 'success' });
        atualizarLista();
      } catch (error) {
        notification({ message: 'Erro ao deletar vistoria!', type: 'error' });
      }
    }
  };

  // Handler para abrir modal de criar
  const handleNovaVistoria = () => {
    setModalCriarOpen(true);
  };

  // Fechar modal de criar
  const handleFecharModalCriar = () => {
    setModalCriarOpen(false);
  };

  // Handler para abrir modal de editar
  const handleEditarVistoria = (item) => {
    setVistoriaSelecionada(item);
    setModalEditarOpen(true);
  };

  // Fechar modal de editar
  const handleFecharModalEditar = () => {
    setVistoriaSelecionada(null);
    setModalEditarOpen(false);
  };

  // Handler para abrir modal de detalhes
  const handleDetalhesVistoria = (item) => {
    setVistoriaDetalhes(item);
    setModalDetalhesOpen(true);
  };

  // Fechar modal de detalhes
  const handleFecharModalDetalhes = () => {
    setModalDetalhesOpen(false);
    setVistoriaDetalhes(null);
  };

  // Handlers de pesquisa, filtro de status e paginação
  const handlePesquisaChange = (event) => {
    setPesquisa(event.target.value);
    setPage(0);
  };

  const handleStatusChange = (event) => {
    setStatusFiltro(event.target.value);
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

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Atualiza a lista após criação/edição
  const atualizarLista = () => {
    buscarVistorias();
  };

  // Formata a data para exibição
  const formatarData = (dataISO) => {
    if (!dataISO) return 'Sem data';
    const data = new Date(dataISO);
    data.setHours(data.getHours() - 3);
    return data.toLocaleDateString('pt-BR');
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
        <TextField
          label="Pesquisar por Técnico ou Data"
          variant="outlined"
          value={pesquisa}
          onChange={handlePesquisaChange}
          sx={{ width: '300px' }}
        />
        <Button onClick={handleNovaVistoria} variant="contained" sx={{ width: { xs: '100%', sm: 'auto' } }}>
          Nova Vistoria
        </Button>
      </Box>

      <MainCard title="Vistorias de Ferramentas">
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
                  <TableCell>Técnico</TableCell>
                  <TableCell sortDirection={sortColumn === 'data_vistoria' ? sortDirection : false}>
                    <TableSortLabel
                      active={sortColumn === 'data_vistoria'}
                      direction={sortColumn === 'data_vistoria' ? sortDirection : 'asc'}
                      onClick={() => handleSort('data_vistoria')}
                    >
                      Data da Vistoria
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={sortColumn === 'status' ? sortDirection : false}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <FormControl sx={{ width: 180, marginRight: 1 }}>
                        <InputLabel>Status</InputLabel>
                        <Select value={statusFiltro} onChange={handleStatusChange} label="Status">
                          <MenuItem value="">Todos</MenuItem>
                          <MenuItem value="a vistoriar">A Vistoriar</MenuItem>
                          <MenuItem value="cancelado">Cancelado</MenuItem>
                          <MenuItem value="pendente de agendamento">Pendente de Agendamento</MenuItem>
                          <MenuItem value="vistoriado ok">Vistoriado OK</MenuItem>
                        </Select>
                      </FormControl>
                      <TableSortLabel
                        active={sortColumn === 'status'}
                        direction={sortColumn === 'status' ? sortDirection : 'asc'}
                        onClick={() => handleSort('status')}
                      />
                    </div>
                  </TableCell>
                  <TableCell>Ferramentas</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vistoriasOrdenadas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
                  <TableRow key={item.vistoria.id}>
                    <TableCell>{item.vistoria.tecnico_nome}</TableCell>
                    <TableCell>{formatarData(item.vistoria.data_vistoria)}</TableCell>
                    <TableCell>{renderStatus(item.vistoria.status)}</TableCell>
                    <TableCell>{renderFerramentas(item.itens)}</TableCell>
                    <TableCell>
                      <Tooltip title="Editar">
                        <IconButton onClick={() => handleEditarVistoria(item)}>
                          <EditOutlined />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Ver Galeria Ferramentas">
                        <IconButton component={Link} to={`/admin/galeriaferramentas/${item.vistoria.id}`}>
                          <PictureOutlined />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Ver Detalhes">
                        <IconButton onClick={() => handleDetalhesVistoria(item)}>
                          <EyeOutlined />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Deletar">
                        <IconButton onClick={() => handleDeletarVistoria(item)}>
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
              count={vistoriasOrdenadas.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleMudancaPagina}
              onRowsPerPageChange={handleMudancaLinhasPorPagina}
              labelRowsPerPage="Linhas por página:"
            />
          </Box>
        </Box>
      </MainCard>

      {/* Componentes de criação e edição */}
      <CriarVistoriaFerramentas open={modalCriarOpen} onClose={handleFecharModalCriar} onSuccess={atualizarLista} />
      <EditarVistoriaFerramentas
        open={modalEditarOpen}
        onClose={handleFecharModalEditar}
        onSuccess={atualizarLista}
        vistoria={vistoriaSelecionada}
      />

      {/* Modal de detalhes */}
      <VerDetalhesVistoriaFerramentas open={modalDetalhesOpen} onClose={handleFecharModalDetalhes} vistoria={vistoriaDetalhes} />
    </Box>
  );
};

export default VistoriasFerramentas;
