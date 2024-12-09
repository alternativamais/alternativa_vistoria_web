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
import CriarVeiculo from './components/CriarVeiculo';
import EditarVeiculo from './components/EditarVeiculo';
import { api } from 'services/api';
import { notification } from 'components/notification/index';

const Veiculos = () => {
  const [veiculos, setVeiculos] = useState([]);
  const [veiculosFiltrados, setVeiculosFiltrados] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [pesquisa, setPesquisa] = useState('');
  const [modalCriarOpen, setModalCriarOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [veiculoSelecionado, setVeiculoSelecionado] = useState(null);

  useEffect(() => {
    buscarVeiculos();
  }, []);

  useEffect(() => {
    filtrarVeiculos();
  }, [pesquisa, veiculos]);

  const buscarVeiculos = async () => {
    try {
      const response = await api.get('/veiculos');
      setVeiculos(response.data);
      setVeiculosFiltrados(response.data);
    } catch (error) {
      notification({ message: 'Erro ao buscar veículos!', type: 'error' });
    }
  };

  const filtrarVeiculos = () => {
    const filtrados = veiculos.filter((veiculo) => veiculo.modelo.toLowerCase().includes(pesquisa.toLowerCase()));
    setVeiculosFiltrados(filtrados);
  };

  const handleMudancaPagina = (event, novaPagina) => {
    setPage(novaPagina);
  };

  const handleMudancaLinhasPorPagina = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleNovoVeiculo = () => {
    setModalCriarOpen(true);
  };

  const handleFecharModalCriar = () => {
    setModalCriarOpen(false);
  };

  const handleEditarVeiculo = (veiculo) => {
    setVeiculoSelecionado(veiculo);
    setModalEditarOpen(true);
  };

  const handleFecharModalEditar = () => {
    setVeiculoSelecionado(null);
    setModalEditarOpen(false);
  };

  const atualizarListaVeiculos = () => {
    buscarVeiculos();
  };

  const handlePesquisaChange = (event) => {
    setPesquisa(event.target.value);
    setPage(0);
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px' }}>
        <TextField
          label="Pesquisar por modelo"
          variant="outlined"
          value={pesquisa}
          onChange={handlePesquisaChange}
          sx={{ width: '300px' }}
        />
        <Button onClick={handleNovoVeiculo} variant="contained">
          Novo Veículo
        </Button>
      </Box>
      <MainCard title="Veículos">
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
                  <TableCell>Placa</TableCell>
                  <TableCell>Modelo</TableCell>
                  <TableCell>Marca</TableCell>
                  <TableCell>Cor</TableCell>
                  <TableCell>Ano</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {veiculosFiltrados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((veiculo) => (
                  <TableRow key={veiculo.id}>
                    <TableCell>{veiculo.placa}</TableCell>
                    <TableCell>{veiculo.modelo}</TableCell>
                    <TableCell>{veiculo.marca}</TableCell>
                    <TableCell>{veiculo.cor}</TableCell>
                    <TableCell>{veiculo.ano}</TableCell>
                    <TableCell>
                      <Chip
                        label={veiculo.status}
                        sx={{
                          backgroundColor: veiculo.status === 'Disponível' ? 'green' : 'gray',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEditarVeiculo(veiculo)}>
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
            count={veiculosFiltrados.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleMudancaPagina}
            onRowsPerPageChange={handleMudancaLinhasPorPagina}
            labelRowsPerPage="Linhas por página:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`}
          />
        </Box>
      </MainCard>
      <CriarVeiculo open={modalCriarOpen} onClose={handleFecharModalCriar} onSuccess={atualizarListaVeiculos} />
      <EditarVeiculo
        open={modalEditarOpen}
        onClose={handleFecharModalEditar}
        onSuccess={atualizarListaVeiculos}
        veiculo={veiculoSelecionado}
      />
    </Box>
  );
};

export default Veiculos;
