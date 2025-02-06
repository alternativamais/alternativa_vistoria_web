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
  Tooltip,
  TableSortLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography
} from '@mui/material';
import { EditOutlined, PictureOutlined, EyeOutlined } from '@ant-design/icons';
import MainCard from 'components/sistema/MainCard';
import EditarCorrecao from './components/editarCorrecao';
import VerDetalhesVistoria from 'pages/Vistorias/components/VerDetalhesVistoria';
import { api } from 'services/api';
import { Link } from 'react-router-dom';
import { notification } from 'components/notification/index';
import { generateXlsxReport } from './components/generateXlsxReport';

const Correcao = () => {
  const [page, setPage] = useState(() => {
    const paginaSalva = localStorage.getItem('paginaVistorias');
    return paginaSalva ? parseInt(paginaSalva, 10) : 0;
  });

  const [rowsPerPage, setRowsPerPage] = useState(() => {
    const linhasSalvas = localStorage.getItem('linhasPorPaginaVistorias');
    return linhasSalvas ? parseInt(linhasSalvas, 10) : 5;
  });

  const [pesquisa, setPesquisa] = useState(() => {
    const pesquisaSalva = localStorage.getItem('pesquisaVistorias');
    return pesquisaSalva ? pesquisaSalva : '';
  });

  // Filtro de status
  const [statusFiltro, setStatusFiltro] = useState(() => {
    const statusSalvo = localStorage.getItem('statusFiltroVistorias');
    return statusSalvo ? statusSalvo : '';
  });

  const [sortColumn, setSortColumn] = useState(() => {
    const colunaSalva = localStorage.getItem('sortColumnVistorias');
    return colunaSalva ? colunaSalva : null;
  });

  const [sortDirection, setSortDirection] = useState(() => {
    const direcaoSalva = localStorage.getItem('sortDirectionVistorias');
    return direcaoSalva ? direcaoSalva : 'asc';
  });

  const [vistorias, setVistorias] = useState([]);
  const [vistoriasFiltradas, setVistoriasFiltradas] = useState([]);

  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [vistoriaSelecionada, setVistoriaSelecionada] = useState(null);

  const [modalDetalhesOpen, setModalDetalhesOpen] = useState(false);
  const [vistoriaDetalhes, setVistoriaDetalhes] = useState(null);

  useEffect(() => {
    buscarVistorias();
  }, []);

  useEffect(() => {
    filtrarVistorias();
  }, [pesquisa, statusFiltro, vistorias]);

  useEffect(() => {
    localStorage.setItem('paginaVistorias', page.toString());
  }, [page]);

  useEffect(() => {
    localStorage.setItem('linhasPorPaginaVistorias', rowsPerPage.toString());
  }, [rowsPerPage]);

  useEffect(() => {
    localStorage.setItem('pesquisaVistorias', pesquisa);
  }, [pesquisa]);

  useEffect(() => {
    localStorage.setItem('statusFiltroVistorias', statusFiltro);
  }, [statusFiltro]);

  useEffect(() => {
    if (sortColumn !== null) {
      localStorage.setItem('sortColumnVistorias', sortColumn);
    }
  }, [sortColumn]);

  useEffect(() => {
    if (sortDirection !== null) {
      localStorage.setItem('sortDirectionVistorias', sortDirection);
    }
  }, [sortDirection]);

  const buscarVistorias = async () => {
    try {
      const response = await api.get('/vistorias');

      // Filtra de antemão apenas as vistorias com os 3 status desejados:
      const vistoriasAjustadas = response.data.filter((vistoria) => {
        const statusLower = vistoria.status?.toLowerCase() || '';
        return ['correcao pendente de agendamento', 'correcao impedida', 'correcao agendada'].includes(statusLower);
      });

      setVistorias(vistoriasAjustadas);
      setVistoriasFiltradas(vistoriasAjustadas);
    } catch (error) {
      notification({ message: 'Erro ao buscar vistorias!', type: 'error' });
    }
  };

  const filtrarVistorias = () => {
    let filtradas = [...vistorias];

    // Filtro por pesquisa (nome do cliente)
    if (pesquisa.trim() !== '') {
      filtradas = filtradas.filter((vistoria) => vistoria.nomeCliente?.toLowerCase().includes(pesquisa.toLowerCase()));
    }

    // Filtro adicional por status (apenas entre os 3 já permitidos)
    if (statusFiltro.trim() !== '') {
      filtradas = filtradas.filter((vistoria) => vistoria.status.toLowerCase() === statusFiltro.toLowerCase());
    }

    setVistoriasFiltradas(filtradas);
  };

  const formatarDataHoraParaBrasil = (dataISO) => {
    if (!dataISO) {
      return 'Não Concluída';
    }
    const data = new Date(dataISO);
    data.setHours(data.getHours() - 3);
    return data.toLocaleString('pt-BR', { timeZone: 'UTC' });
  };

  const handleMudancaPagina = (event, newPage) => {
    setPage(newPage);
  };

  const handleMudancaLinhasPorPagina = (event) => {
    const novasLinhas = parseInt(event.target.value, 10);
    setRowsPerPage(novasLinhas);
    setPage(0);
  };

  const handleEditarVistoria = (vistoria) => {
    setVistoriaSelecionada(vistoria);
    setModalEditarOpen(true);
  };

  const handleFecharModalEditar = () => {
    setVistoriaSelecionada(null);
    setModalEditarOpen(false);
  };

  const handleAbrirModalDetalhes = (vistoria) => {
    setVistoriaDetalhes(vistoria);
    setModalDetalhesOpen(true);
  };

  const handleFecharModalDetalhes = () => {
    setVistoriaDetalhes(null);
    setModalDetalhesOpen(false);
  };

  const atualizarListaVistorias = () => {
    buscarVistorias();
  };

  const handlePesquisaChange = (event) => {
    setPesquisa(event.target.value);
    setPage(0);
  };

  const handleStatusChange = (event) => {
    setStatusFiltro(event.target.value);
    setPage(0);
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection((prevDirection) => (prevDirection === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const ordenarVistorias = (a, b) => {
    if (!sortColumn) return 0;

    let valorA = '';
    let valorB = '';

    switch (sortColumn) {
      case 'nomeCliente':
        valorA = a.nomeCliente?.toLowerCase() || '';
        valorB = b.nomeCliente?.toLowerCase() || '';
        break;
      case 'tipoVistoria':
        valorA = a.tipoVistoria?.toLowerCase() || '';
        valorB = b.tipoVistoria?.toLowerCase() || '';
        break;
      case 'status':
        valorA = a.status?.toLowerCase() || '';
        valorB = b.status?.toLowerCase() || '';
        break;
      case 'dataAgendamentoCorrecao':
        valorA = a.dataAgendamentoCorrecao ? new Date(a.dataAgendamentoCorrecao).getTime() : 0;
        valorB = b.dataAgendamentoCorrecao ? new Date(b.dataAgendamentoCorrecao).getTime() : 0;
        break;
      case 'dataConclusaoCorrecao':
        valorA = a.dataConclusaoCorrecao ? new Date(a.dataConclusaoCorrecao).getTime() : 0;
        valorB = b.dataConclusaoCorrecao ? new Date(b.dataConclusaoCorrecao).getTime() : 0;
        break;
      default:
        return 0;
    }

    if (valorA < valorB) {
      return sortDirection === 'asc' ? -1 : 1;
    } else if (valorA > valorB) {
      return sortDirection === 'asc' ? 1 : -1;
    } else {
      return 0;
    }
  };

  const vistoriasOrdenadas = [...vistoriasFiltradas].sort(ordenarVistorias);

  return (
    <Box sx={{ padding: '20px' }}>
      {/* CAMPO DE PESQUISA */}
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
          label="Pesquisar por cliente"
          variant="outlined"
          value={pesquisa}
          onChange={handlePesquisaChange}
          sx={{ width: '300px' }}
        />
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
                  <TableCell sortDirection={sortColumn === 'nomeCliente' ? sortDirection : false}>
                    <TableSortLabel
                      active={sortColumn === 'nomeCliente'}
                      direction={sortColumn === 'nomeCliente' ? sortDirection : 'asc'}
                      onClick={() => handleSort('nomeCliente')}
                    >
                      Cliente
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={sortColumn === 'tipoVistoria' ? sortDirection : false}>
                    <TableSortLabel
                      active={sortColumn === 'tipoVistoria'}
                      direction={sortColumn === 'tipoVistoria' ? sortDirection : 'asc'}
                      onClick={() => handleSort('tipoVistoria')}
                    >
                      Tipo de Vistoria
                    </TableSortLabel>
                  </TableCell>
                  {/* Filtro de Status contendo APENAS os 3 valores de correcao */}
                  <TableCell sortDirection={sortColumn === 'status' ? sortDirection : false}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <FormControl sx={{ width: 220 }}>
                        <InputLabel>Status</InputLabel>
                        <Select value={statusFiltro} onChange={handleStatusChange} label="Status">
                          <MenuItem value="">Todos</MenuItem>
                          <MenuItem value="correcao pendente de agendamento">Correcao Pendente de Agendamento</MenuItem>
                          <MenuItem value="correcao impedida">Correcao Impedida</MenuItem>
                          <MenuItem value="correcao agendada">Correcao Agendada</MenuItem>
                        </Select>
                      </FormControl>
                      <TableSortLabel
                        active={sortColumn === 'status'}
                        direction={sortColumn === 'status' ? sortDirection : 'asc'}
                        onClick={() => handleSort('status')}
                      />
                    </div>
                  </TableCell>
                  {/* Colunas NOVAS: dataAgendamentoCorrecao e dataConclusaoCorrecao */}
                  <TableCell sortDirection={sortColumn === 'dataAgendamentoCorrecao' ? sortDirection : false}>
                    <TableSortLabel
                      active={sortColumn === 'dataAgendamentoCorrecao'}
                      direction={sortColumn === 'dataAgendamentoCorrecao' ? sortDirection : 'asc'}
                      onClick={() => handleSort('dataAgendamentoCorrecao')}
                    >
                      Agendamento Correção
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sortDirection={sortColumn === 'dataConclusaoCorrecao' ? sortDirection : false}>
                    <TableSortLabel
                      active={sortColumn === 'dataConclusaoCorrecao'}
                      direction={sortColumn === 'dataConclusaoCorrecao' ? sortDirection : 'asc'}
                      onClick={() => handleSort('dataConclusaoCorrecao')}
                    >
                      Conclusão Correção
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {vistoriasOrdenadas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((vistoria) => (
                  <TableRow key={vistoria.id}>
                    <TableCell>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <Typography>{vistoria.nomeCliente}</Typography>
                        {vistoria.idSgp ? (
                          <a
                            href={`https://alternativaip.sgp.net.br/admin/cliente/${vistoria.idSgp}/contratos/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              textDecoration: 'none',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center'
                            }}
                          >
                            <Chip
                              sx={{
                                display: 'flex',
                                padding: '13px',
                                paddingRight: 0,
                                backgroundColor: '#4B545C'
                              }}
                              icon={
                                /* icone SGP */
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  xmlSpace="preserve"
                                  width="60px"
                                  height="18px"
                                  version="1.1"
                                  style={{
                                    shapeRendering: 'geometricPrecision',
                                    textRendering: 'geometricPrecision',
                                    imageRendering: 'optimizeQuality',
                                    fillRule: 'evenodd',
                                    clipRule: 'evenodd'
                                  }}
                                  viewBox="0 0 8043 3133"
                                >
                                  <defs>
                                    <style type="text/css">{`.fil0 {fill:#F2F2F2}`}</style>
                                  </defs>
                                  <g id="Camada_x0020_1">
                                    <metadata id="CorelCorpID_0Corel-Layer" />
                                    <g id="_2112558215968">
                                      <path
                                        className="fil0"
                                        d="M5323 2053l44 0 0 41 -44 0 0 -41zm43 -50l49 0 0 49 -49 0 0 -49zm-68 -59l59 0 0 60 -59 0 0 -60zm141 34l24 0 0 25 -24 0 0 -25zm688 185l310 0 0 -112 -302 0c-130,0 -192,98 -192,188 0,106 86,188 192,188l107 0c38,2 72,35 72,76 0,29 -19,57 -46,69l-286 -1 121 121 144 0c103,-1 190,-88 190,-196 0,-107 -86,-196 -194,-195l-116 -4c-30,0 -45,-20 -46,-20 -41,-42 -12,-114 46,-114zm1653 -19l-94 -94 -224 224 -224 -224 -94 94 224 224 -224 224 94 94 224 -224 224 224 94 -94 -224 -224 224 -224zm-2413 34l183 0 0 514 126 0 0 -514 211 2c25,-75 63,-117 119,-129l-639 0 0 127zm1424 143l-303 -272 0 641 130 0 0 -343 0 1 173 126 174 -126 0 -1 0 343 129 0 0 -641 -303 272zm-728 371l-120 0 0 -121 120 121zm-540 -550l-42 0 0 -40 42 0 0 40zm-42 -41l-63 0 0 -50 63 0 0 50zm-86 -50l0 25 -28 0 0 -25 28 0z"
                                      />
                                      <path
                                        className="fil0"
                                        d="M4551 2788c47,12 269,4 334,4 148,0 191,5 191,-152 -1,-221 8,-459 -1,-678l-524 -2 0 828z"
                                      />
                                      <path
                                        className="fil0"
                                        d="M307 2267c5,584 -93,525 391,525 182,0 761,11 901,-15 239,-46 428,-224 515,-399 225,-453 -73,-1034 -612,-1072 -141,-10 -311,-2 -456,-2 -84,0 -124,-5 -178,-50 -152,-128 -74,-381 136,-387 440,-13 930,15 1379,-1 60,-139 269,-327 394,-419 61,-45 149,-87 172,-105 -144,-8 -312,-1 -459,-1l-1383 0c-356,0 -490,74 -663,259 -325,347 -202,999 298,1183 173,63 435,46 641,46 90,1 126,-3 191,42 86,60 131,207 41,314 -91,108 -211,81 -382,81 -154,0 -309,0 -463,0 -150,0 -315,-6 -463,1z"
                                      />
                                      <path
                                        className="fil0"
                                        d="M4419 1962l-524 -2 -1 218c-59,23 -98,49 -173,67 -227,57 -498,-7 -654,-164l-61 -66c-130,-161 -190,-346 -152,-569 44,-264 233,-456 445,-537 273,-105 604,3 736,161 31,-12 349,-339 374,-366 -34,-59 -208,-175 -274,-214 -98,-58 -231,-106 -360,-129 -304,-54 -583,0 -815,125 -206,111 -370,285 -490,485 -128,213 -181,527 -133,817 81,482 489,896 972,983 286,51 599,2 822,-122 61,-34 256,-159 284,-203 14,-22 6,-424 4,-484z"
                                      />
                                      <path
                                        className="fil0"
                                        d="M3369 1358l1 471c180,7 710,0 889,0l156 0c-27,-38 -98,-101 -134,-137l-346 -346c-43,-43 -22,-41 -115,-42l-451 0 0 54z"
                                      />
                                      <path
                                        className="fil0"
                                        d="M6522 1145l0 -120 -8 -33c-2,-13 -3,-23 -5,-36 -35,-221 -194,-432 -385,-530 -77,-39 -153,-67 -252,-79 -79,-9 -1273,-12 -1322,-3l1 826c29,7 485,7 525,1l0 -304c136,-1 271,0 405,0 98,0 312,-15 387,20 81,36 159,146 113,273 -48,133 -155,144 -266,144 -544,0 -1088,1 -1632,0l506 512c25,22 46,13 104,13l685 0c416,0 761,53 1025,-343 28,-42 57,-98 76,-152 16,-48 32,-166 43,-189z"
                                      />
                                    </g>
                                  </g>
                                </svg>
                              }
                            />
                          </a>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>{vistoria.tipoVistoria}</TableCell>
                    <TableCell>
                      <Chip
                        label={vistoria.status
                          .toString()
                          .toLowerCase()
                          .split(' ')
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ')}
                        sx={{
                          backgroundColor:
                            vistoria.status === 'correcao pendente de agendamento'
                              ? '#FFEB3B' // Amarelo
                              : vistoria.status === 'correcao impedida'
                                ? '#F44336' // Vermelho
                                : vistoria.status === 'correcao agendada'
                                  ? '#2196F3' // Azul
                                  : '#E0E0E0', // Default (caso apareça algo fora do esperado)
                          color: vistoria.status === 'correcao pendente de agendamento' ? '#000000' : '#FFFFFF',
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>
                    {/* NOVA COLUNA: Agendamento Correção */}
                    <TableCell>
                      {vistoria.dataAgendamentoCorrecao
                        ? formatarDataHoraParaBrasil(vistoria.dataAgendamentoCorrecao)
                        : 'Pendente de Agendamento'}
                    </TableCell>
                    {/* NOVA COLUNA: Conclusão Correção */}
                    <TableCell>
                      {vistoria.dataConclusaoCorrecao ? formatarDataHoraParaBrasil(vistoria.dataConclusaoCorrecao) : 'Não Concluída'}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Editar">
                        <IconButton onClick={() => handleEditarVistoria(vistoria)}>
                          <EditOutlined />
                        </IconButton>
                      </Tooltip>
                      {vistoria.imagem ? (
                        <Tooltip title="Ver Galeria">
                          <IconButton component={Link} to={`/admin/galeria/${vistoria.id}`}>
                            <PictureOutlined />
                          </IconButton>
                        </Tooltip>
                      ) : null}
                      <Tooltip title="Ver Detalhes">
                        <IconButton onClick={() => handleAbrirModalDetalhes(vistoria)}>
                          <EyeOutlined />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Button variant="contained" color="primary" onClick={generateXlsxReport}>
              Gerar Relatório XLSX
            </Button>
            <TablePagination
              rowsPerPageOptions={[5, 10, 15, 100, 200, 500, 1000]}
              component="div"
              count={vistoriasOrdenadas.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleMudancaPagina}
              onRowsPerPageChange={handleMudancaLinhasPorPagina}
              labelRowsPerPage="Linhas por página:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`}
            />
          </div>
        </Box>
      </MainCard>

      {/* MODAL DE EDIÇÃO */}
      <EditarCorrecao
        open={modalEditarOpen}
        onClose={handleFecharModalEditar}
        onSuccess={atualizarListaVistorias}
        vistoria={vistoriaSelecionada}
      />

      {/* MODAL DE DETALHES */}
      <VerDetalhesVistoria open={modalDetalhesOpen} onClose={handleFecharModalDetalhes} vistoria={vistoriaDetalhes} />
    </Box>
  );
};

export default Correcao;
