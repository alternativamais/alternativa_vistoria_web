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
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import MainCard from 'components/sistema/MainCard';
import { api } from 'services/api';
import { notification } from 'components/notification';

import CriarFerramenta from './components/CriarFerramenta';
import EditarFerramenta from './components/EditarFerramenta';
// import VerDetalhesFerramenta from './components/VerDetalhesFerramenta';

const Ferramentas = () => {
  const [page, setPage] = useState(() => {
    const saved = localStorage.getItem('paginaFerramentas');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    const saved = localStorage.getItem('linhasPorPaginaFerramentas');
    return saved ? parseInt(saved, 10) : 5;
  });
  const [pesquisa, setPesquisa] = useState(() => {
    const saved = localStorage.getItem('pesquisaFerramentas');
    return saved || '';
  });

  const [ferramentas, setFerramentas] = useState([]);
  const [ferramentasFiltradas, setFerramentasFiltradas] = useState([]);

  const [modalCriarOpen, setModalCriarOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [ferramentaSelecionada, setFerramentaSelecionada] = useState(null);
  const [modalDetalhesOpen, setModalDetalhesOpen] = useState(false);
  const [ferramentaDetalhes, setFerramentaDetalhes] = useState(null);

  const buscarFerramentas = async () => {
    try {
      const response = await api.get('/ferramentas');
      setFerramentas(response.data);
      setFerramentasFiltradas(response.data);
    } catch (error) {
      notification({ message: 'Erro ao buscar ferramentas!', type: 'error' });
    }
  };

  useEffect(() => {
    buscarFerramentas();
  }, []);

  useEffect(() => {
    const filtrados = ferramentas.filter((item) => item.nome.toLowerCase().includes(pesquisa.toLowerCase()));
    setFerramentasFiltradas(filtrados);
  }, [pesquisa, ferramentas]);

  useEffect(() => {
    localStorage.setItem('paginaFerramentas', page.toString());
  }, [page]);
  useEffect(() => {
    localStorage.setItem('linhasPorPaginaFerramentas', rowsPerPage.toString());
  }, [rowsPerPage]);
  useEffect(() => {
    localStorage.setItem('pesquisaFerramentas', pesquisa);
  }, [pesquisa]);

  const handleDeletarFerramenta = async (item) => {
    if (window.confirm('Deseja realmente deletar esta ferramenta?')) {
      try {
        await api.delete(`/ferramentas/${item.id}`);
        notification({ message: 'Ferramenta deletada com sucesso!', type: 'success' });
        buscarFerramentas();
      } catch (error) {
        notification({ message: 'Erro ao deletar ferramenta!', type: 'error' });
      }
    }
  };

  const handleNovaCriacao = () => {
    setModalCriarOpen(true);
  };

  const handleFecharModalCriar = () => {
    setModalCriarOpen(false);
  };

  const handleEditarFerramenta = (item) => {
    setFerramentaSelecionada(item);
    setModalEditarOpen(true);
  };

  const handleFecharModalEditar = () => {
    setFerramentaSelecionada(null);
    setModalEditarOpen(false);
  };

  const handleDetalhesFerramenta = (item) => {
    setFerramentaDetalhes(item);
    setModalDetalhesOpen(true);
  };

  const handleFecharModalDetalhes = () => {
    setFerramentaDetalhes(null);
    setModalDetalhesOpen(false);
  };

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
          Nova Ferramenta
        </Button>
      </Box>

      <MainCard title="Ferramentas">
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
                  <TableCell>Valor</TableCell>
                  <TableCell>Número Nota Fiscal</TableCell>
                  <TableCell>Local de Compra</TableCell>
                  <TableCell>Data de Compra</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ferramentasFiltradas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.nome}</TableCell>
                    <TableCell>{item.valor}</TableCell>
                    <TableCell>{item.numero_nota_fiscal}</TableCell>
                    <TableCell>{item.local_compra}</TableCell>
                    <TableCell>{formatarData(item.data_compra)}</TableCell>
                    <TableCell>
                      <Tooltip title="Editar">
                        <IconButton onClick={() => handleEditarFerramenta(item)}>
                          <EditOutlined />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Deletar">
                        <IconButton onClick={() => handleDeletarFerramenta(item)}>
                          <DeleteOutlined />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Ver Detalhes">
                        <IconButton onClick={() => handleDetalhesFerramenta(item)}>
                          <EyeOutlined />
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
              count={ferramentasFiltradas.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleMudancaPagina}
              onRowsPerPageChange={handleMudancaLinhasPorPagina}
              labelRowsPerPage="Linhas por página:"
            />
          </Box>
        </Box>
      </MainCard>

      <CriarFerramenta open={modalCriarOpen} onClose={handleFecharModalCriar} onSuccess={buscarFerramentas} />
      <EditarFerramenta
        open={modalEditarOpen}
        onClose={handleFecharModalEditar}
        onSuccess={buscarFerramentas}
        ferramenta={ferramentaSelecionada}
      />

      {/* <VerDetalhesFerramenta open={modalDetalhesOpen} onClose={handleFecharModalDetalhes} ferramenta={ferramentaDetalhes} /> */}
    </Box>
  );
};

export default Ferramentas;
