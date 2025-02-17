/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Tabs,
  Tab,
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip
} from '@mui/material';
import { InfoCircleOutlined, FileSearchOutlined, CheckSquareOutlined, IdcardOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { api } from 'services/api';

const DetailItem = ({ icon, label, value, divider = true }) => {
  return (
    <>
      <ListItem disableGutters sx={{ py: 0.5 }}>
        {icon && <ListItemIcon sx={{ minWidth: 30 }}>{icon}</ListItemIcon>}
        <ListItemText
          primary={
            <Typography variant="body2" color="text.primary">
              <strong>{label}:</strong> {value || 'Não informado'}
            </Typography>
          }
        />
      </ListItem>
      {divider && <Divider component="li" />}
    </>
  );
};

const VerDetalhesVistoria = ({ open, onClose, vistoria }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [imagens, setImagens] = useState([]);
  const navigate = useNavigate();

  const handleChangeTab = (event, newValue) => {
    setSelectedTab(newValue);
  };

  useEffect(() => {
    if (!open) {
      setImagens([]);
    }
  }, [open]);

  useEffect(() => {
    const fetchImagens = async () => {
      try {
        const response = await api.get(`/imagens-vistorias/vistoria/${vistoria.id}`);
        setImagens(response.data);
      } catch (error) {
        console.error('Erro de requisição:', error);
      }
    };
    if (vistoria?.id) {
      fetchImagens();
    }
  }, [vistoria]);

  const handleImageClick = () => {
    if (vistoria?.id) {
      navigate(`/admin/galeria/${vistoria.id}`);
    }
  };

  if (!vistoria) {
    return null;
  }

  const formatarDataHoraParaBrasil = (dataISO) => {
    if (!dataISO) {
      return 'Não Concluída';
    }
    const data = new Date(dataISO);
    data.setHours(data.getHours() - 3);
    return data.toLocaleString('pt-BR', { timeZone: 'UTC' });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="body"
      sx={{
        '& .MuiDialog-paper': {
          margin: { xs: 1, sm: 2 },
          width: '100%',
          borderRadius: 2
        }
      }}
    >
      <DialogTitle sx={{ pb: 0.5 }}>
        <Typography variant="h6">Detalhes da Vistoria</Typography>
      </DialogTitle>

      <Card
        elevation={0}
        sx={{
          mx: 2,
          mt: 1,
          mb: 2,
          backgroundColor: '#f5f5f5',
          borderRadius: 2,
          p: 1
        }}
      >
        <CardContent sx={{ p: 1 }}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  position: 'relative',
                  width: 220,
                  height: 170,
                  margin: '0 auto'
                }}
              >
                {imagens && imagens.length > 0 ? (
                  imagens.map((imagem, index) => (
                    <Box
                      key={imagem.id}
                      onClick={handleImageClick}
                      sx={{
                        position: 'absolute',
                        top: index * 2,
                        left: index * 2,
                        width: 190,
                        height: 190,
                        transform: `rotate(${index * 2 - 10}deg)`,
                        boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.3)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        cursor: 'pointer'
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={imagem.url}
                        alt={`Imagem da vistoria ${imagem.id}`}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', mt: 8 }}>
                    Nenhuma imagem encontrada.
                  </Typography>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} sm={8}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {vistoria.nomeCliente || 'Título da Vistoria'}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                gutterBottom
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {vistoria.resumoVistoria || 'Resumo não disponível'}
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                <Chip label={`ID: ${vistoria.id || 'N/D'}`} size="small" icon={<IdcardOutlined />} />
                <Chip label={`Status: ${vistoria.status || 'N/D'}`} size="small" />
              </Box>
            </Grid>
          </Grid>
        </CardContent>

        {vistoria.idSgp && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', pr: 1, pb: 1 }}>
            <a
              href={`https://alternativaip.sgp.net.br/admin/cliente/${vistoria.idSgp}/contratos/`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
            >
              <Chip
                sx={{
                  display: 'flex',
                  padding: '13px',
                  paddingRight: 0,
                  backgroundColor: '#4B545C'
                }}
                icon={
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
          </Box>
        )}
      </Card>

      <Tabs
        value={selectedTab}
        onChange={handleChangeTab}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        sx={{ px: 1, mb: 1 }}
      >
        <Tab icon={<InfoCircleOutlined />} iconPosition="start" label="Informações Gerais" />
        <Tab icon={<FileSearchOutlined />} iconPosition="start" label="Dados Técnicos" />
        <Tab icon={<CheckSquareOutlined />} iconPosition="start" label="Status e Datas" />
      </Tabs>

      <DialogContent dividers sx={{ p: 1 }}>
        {selectedTab === 0 && (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <List disablePadding>
              <DetailItem icon={<InfoCircleOutlined />} label="Tipo de Vistoria" value={vistoria.tipoVistoria} />
              <DetailItem icon={<IdcardOutlined />} label="Nome do Cliente" value={vistoria.nomeCliente} />
              <DetailItem icon={<InfoCircleOutlined />} label="Endereço do Cliente" value={vistoria.enderecoCliente} />
              <DetailItem
                icon={<CheckSquareOutlined />}
                label="Assinatura Eletrônica"
                value={vistoria.assinaturaEletronica ? 'Sim' : 'Não'}
                divider={false}
              />
            </List>
          </Paper>
        )}

        {selectedTab === 1 && (
          <Paper variant="outlined" sx={{ p: 1 }}>
            <List disablePadding>
              {vistoria.tipoVistoria === 'rede' ? (
                <DetailItem icon={<FileSearchOutlined />} label="Coordenadas da CTO" value={vistoria.coordenadasCto} />
              ) : (
                <DetailItem
                  icon={<FileSearchOutlined />}
                  label="Coordenadas do Endereço do Cliente"
                  value={vistoria.coordenadasEnderecoCliente}
                />
              )}
              <DetailItem icon={<InfoCircleOutlined />} label="Resumo da Vistoria" value={vistoria.resumoVistoria} />
              <DetailItem icon={<CheckSquareOutlined />} label="Metragem do Cabo" value={vistoria.metragemCabo} divider={false} />
            </List>
          </Paper>
        )}

        {selectedTab === 2 && (
          <Paper variant="outlined" sx={{ p: 1 }}>
            <List disablePadding>
              <DetailItem icon={<InfoCircleOutlined />} label="Status" value={vistoria.status} />
              <DetailItem icon={<FileSearchOutlined />} label="Criação" value={formatarDataHoraParaBrasil(vistoria.dataHoraCriacao)} />
              <DetailItem icon={<FileSearchOutlined />} label="Agendamento" value={formatarDataHoraParaBrasil(vistoria.dataAgendamento)} />
              <DetailItem
                icon={<FileSearchOutlined />}
                label="Conclusão"
                value={formatarDataHoraParaBrasil(vistoria.dataHoraConclusao)}
                divider={false}
              />
            </List>
          </Paper>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VerDetalhesVistoria;
