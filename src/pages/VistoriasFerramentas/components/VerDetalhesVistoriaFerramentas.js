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
  Chip,
  CircularProgress,
  Fade,
  Collapse,
  IconButton
} from '@mui/material';
import {
  InfoCircleOutlined,
  FileSearchOutlined,
  CheckSquareOutlined,
  IdcardOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownOutlined,
  UpOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { api } from 'services/api';

const DetailItem = ({ icon, label, value, divider = true }) => (
  <>
    <ListItem disableGutters sx={{ py: 0.5 }}>
      {icon && <ListItemIcon sx={{ minWidth: 30 }}>{icon}</ListItemIcon>}
      <ListItemText
        primary={
          <Typography variant="body2" color="text.primary">
            <strong>{label}:</strong> {value || `ID: ${value ? '' : '-'}`}
          </Typography>
        }
      />
    </ListItem>
    {divider && <Divider component="li" />}
  </>
);

const VerDetalhesVistoriaFerramentas = ({ open, onClose, vistoria }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [imagens, setImagens] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [expandedChecklists, setExpandedChecklists] = useState({});
  const navigate = useNavigate();

  const handleChangeTab = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Limpar imagens ao fechar
  useEffect(() => {
    if (!open) {
      setImagens([]);
    }
  }, [open]);

  useEffect(() => {
    const fetchImagens = async () => {
      setLoadingImages(true);
      try {
        // Rota ajustada para vistoria de ferramentas
        const response = await api.get(`/imagens-vistorias-ferramentas/vistoria/${vistoria.vistoria.id}`);
        setImagens(response.data);
      } catch (error) {
        console.error('Erro ao buscar imagens:', error);
      } finally {
        setLoadingImages(false);
      }
    };
    if (vistoria?.vistoria?.id) {
      fetchImagens();
    }
  }, [vistoria]);

  const handleImageClick = () => {
    if (vistoria?.vistoria?.id) {
      onClose(); // Fecha o modal para transição mais fluida
      navigate(`/admin/galeria-ferramentas/${vistoria.vistoria.id}`);
    }
  };

  // Atualiza a expansão do checklist utilizando uma chave composta para garantir unicidade
  const toggleChecklist = (compositeId) => {
    setExpandedChecklists((prev) => ({
      ...prev,
      [compositeId]: !prev[compositeId]
    }));
  };

  if (!vistoria) {
    return null;
  }

  const formatarDataHoraParaBrasil = (dataISO) => {
    if (!dataISO) return 'Não informado';
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
      TransitionComponent={Fade}
      transitionDuration={300}
      sx={{
        '& .MuiDialog-paper': {
          margin: { xs: 1, sm: 2 },
          width: '100%',
          borderRadius: 2
        }
      }}
    >
      <DialogTitle sx={{ pb: 0.5 }}>
        <Typography variant="h6">Detalhes da Vistoria de Ferramentas</Typography>
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
                {loadingImages ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : imagens && imagens.length > 0 ? (
                  imagens.slice(-3).map((imagem, index) => (
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
                        cursor: 'pointer',
                        transition: 'transform 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = `rotate(${index * 2 - 10}deg)`;
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={imagem.url}
                        alt={`Imagem da vistoria de ferramentas ${imagem.id}`}
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
                {vistoria.vistoria.tecnico_nome || `ID: ${vistoria.vistoria.id}`}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                gutterBottom
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                Data: {vistoria.vistoria.data_vistoria || `ID: ${vistoria.vistoria.id}`}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                <Chip label={`ID: ${vistoria.vistoria.id || 'N/D'}`} size="small" icon={<IdcardOutlined />} />
                <Chip label={`Status: ${vistoria.vistoria.status || `ID: ${vistoria.vistoria.id}`}`} size="small" />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
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
        <Tab icon={<FileSearchOutlined />} iconPosition="start" label="Checklists" />
        <Tab icon={<CheckSquareOutlined />} iconPosition="start" label="Status e Datas" />
      </Tabs>

      <DialogContent dividers sx={{ p: 1 }}>
        {selectedTab === 0 && (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <List disablePadding>
              <DetailItem
                icon={<InfoCircleOutlined />}
                label="Técnico"
                value={vistoria.vistoria.tecnico_nome || `ID: ${vistoria.vistoria.id}`}
              />
              <DetailItem
                icon={<FileSearchOutlined />}
                label="Data da Vistoria"
                value={vistoria.vistoria.data_vistoria || `ID: ${vistoria.vistoria.id}`}
              />
              <DetailItem icon={<CheckSquareOutlined />} label="Status" value={vistoria.vistoria.status || `ID: ${vistoria.vistoria.id}`} />
            </List>
          </Paper>
        )}

        {selectedTab === 1 && (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Checklists e Itens
            </Typography>
            {vistoria.itens.map((item) => (
              <Box key={item.id} sx={{ mb: 3, p: 1, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Ferramenta: {item.ferramenta_nome || `ID: ${item.id}`}
                </Typography>
                {item.comentario && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Comentário: {item.comentario}
                  </Typography>
                )}
                {item.checklists && item.checklists.length > 0 ? (
                  item.checklists.map((chk) => {
                    const compositeId = `${item.id}-${chk.id}`;
                    return (
                      <Box key={compositeId} sx={{ mb: 2, ml: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 1,
                            backgroundColor: '#f0f0f0',
                            cursor: 'pointer'
                          }}
                          onClick={() => toggleChecklist(compositeId)}
                        >
                          <Typography variant="subtitle2">{chk.nome || `ID: ${chk.id}`}</Typography>
                          <IconButton size="small">{expandedChecklists[compositeId] ? <UpOutlined /> : <DownOutlined />}</IconButton>
                        </Box>
                        <Collapse in={expandedChecklists[compositeId]} timeout="auto" unmountOnExit>
                          <List dense sx={{ pl: 2 }}>
                            {chk.items && chk.items.length > 0 ? (
                              chk.items.map((it) => (
                                <ListItem key={it.id}>
                                  <ListItemIcon>
                                    {it.marked ? (
                                      <CheckCircleOutlined style={{ color: 'green' }} />
                                    ) : (
                                      <CloseCircleOutlined style={{ color: 'red' }} />
                                    )}
                                  </ListItemIcon>
                                  <ListItemText primary={it.titulo || `ID: ${it.id}`} secondary={it.tag ? it.tag : 'Tag não disponível'} />
                                </ListItem>
                              ))
                            ) : (
                              <Typography variant="body2" sx={{ ml: 4 }}>
                                Nenhum item cadastrado.
                              </Typography>
                            )}
                          </List>
                        </Collapse>
                      </Box>
                    );
                  })
                ) : (
                  <Typography variant="body2" sx={{ ml: 2 }}>
                    Nenhum checklist associado.
                  </Typography>
                )}
              </Box>
            ))}
          </Paper>
        )}

        {selectedTab === 2 && (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <List disablePadding>
              <DetailItem icon={<InfoCircleOutlined />} label="Status" value={vistoria.vistoria.status || `ID: ${vistoria.vistoria.id}`} />
              <DetailItem icon={<FileSearchOutlined />} label="Criação" value={formatarDataHoraParaBrasil(vistoria.vistoria.createdAt)} />
              <DetailItem
                icon={<FileSearchOutlined />}
                label="Agendamento"
                value={formatarDataHoraParaBrasil(vistoria.vistoria.dataAgendamento)}
              />
              <DetailItem
                icon={<FileSearchOutlined />}
                label="Conclusão"
                value={formatarDataHoraParaBrasil(vistoria.vistoria.dataHoraConclusao)}
                divider={false}
              />
            </List>
          </Paper>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VerDetalhesVistoriaFerramentas;
