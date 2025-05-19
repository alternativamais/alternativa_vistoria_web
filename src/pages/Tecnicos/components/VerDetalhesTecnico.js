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
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Fade,
  Collapse,
  IconButton,
  CircularProgress
} from '@mui/material';
import {
  InfoCircleOutlined,
  DollarCircleOutlined,
  DownOutlined,
  UpOutlined,
  ToolOutlined,
  FileSearchOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { api } from 'services/api';
import VerDetalhesVistoriaFerramentas from 'pages/VistoriasFerramentas/components/VerDetalhesVistoriaFerramentas';

const DetailItem = ({ icon, label, value, divider = true }) => (
  <>
    <ListItem disableGutters sx={{ py: 0.5 }}>
      {icon && <ListItemIcon sx={{ minWidth: 30 }}>{icon}</ListItemIcon>}
      <ListItemText
        primary={
          <Typography variant="body2" color="text.primary">
            <strong>{label}:</strong> {value || '-'}
          </Typography>
        }
      />
    </ListItem>
    {divider && <Divider component="li" />}
  </>
);

const formatDateFriendly = (dataISO) => {
  if (!dataISO) return 'Não informado';
  const options = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };
  const data = new Date(dataISO);
  data.setHours(data.getHours() - 3);
  return data.toLocaleString('pt-BR', options);
};

const VerDetalhesTecnico = ({ open, onClose, tecnico }) => {
  const [tab, setTab] = useState(0);
  const [expandedFerramentas, setExpandedFerramentas] = useState({});
  const [vistorias, setVistorias] = useState([]);
  const [loadingVistorias, setLoadingVistorias] = useState(false);
  const [modalVistoriaOpen, setModalVistoriaOpen] = useState(false);
  const [selectedVistoria, setSelectedVistoria] = useState(null);

  const [dadosTecnico, setDadosTecnico] = useState(null);
  const [loadingTecnico, setLoadingTecnico] = useState(false);

  useEffect(() => {
    if (!open) {
      setTab(0);
      setExpandedFerramentas({});
      setVistorias([]);
      setDadosTecnico(null);
    }
  }, [open]);

  useEffect(() => {
    if (open && tecnico?.id) {
      const fetchDetalhe = async () => {
        setLoadingTecnico(true);
        try {
          const { data } = await api.get(`/tecnicos/${tecnico.id}`);
          setDadosTecnico(data.tecnico);
        } catch (err) {
          console.error('Erro ao buscar detalhes do técnico:', err);
          setDadosTecnico(null);
        } finally {
          setLoadingTecnico(false);
        }
      };
      fetchDetalhe();
    }
  }, [open, tecnico]);

  useEffect(() => {
    if (open && tecnico?.id) {
      fetchVistorias();
    }
  }, [open, tecnico]);

  const fetchVistorias = async () => {
    setLoadingVistorias(true);
    try {
      const response = await api.get(`/vistoria-ferramentas/tecnico/${tecnico.id}`);
      setVistorias(response.data.data || []);
    } catch (error) {
      console.error('Erro ao buscar vistorias:', error);
      setVistorias([]);
    } finally {
      setLoadingVistorias(false);
    }
  };

  const handleChangeTab = (_, newValue) => setTab(newValue);

  const toggleFerramenta = (id) => setExpandedFerramentas((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleOpenVistoria = (vistoria) => {
    setSelectedVistoria(vistoria);
    setModalVistoriaOpen(true);
  };
  const handleCloseVistoria = () => {
    setSelectedVistoria(null);
    setModalVistoriaOpen(false);
  };

  const handleVerVistoriaTag = (tagValue) => {
    for (const vistoria of vistorias) {
      if (vistoria.itens) {
        for (const item of vistoria.itens) {
          if (item.checklists) {
            for (const chk of item.checklists) {
              if (chk.items?.some((it) => it.tag === tagValue)) {
                handleOpenVistoria(vistoria);
                return;
              }
            }
          }
        }
      }
    }
    console.warn('Nenhuma vistoria encontrada para a tag:', tagValue);
  };

  if (!open) return null;
  if (loadingTecnico || !dadosTecnico) {
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" TransitionComponent={Fade}>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }

  const totalFerramentasCadastradas = dadosTecnico.ferramentas?.length || 0;
  const percentualPerdido =
    dadosTecnico.totalFerramentasOriginal > 0
      ? ((dadosTecnico.totalPerdido / dadosTecnico.totalFerramentasOriginal) * 100).toFixed(2)
      : '0';

  const ferramentasAtivas = dadosTecnico.ferramentas || [];
  const ferramentasDeletadas = dadosTecnico.ferramentasDeletadas || [];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
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
        <Typography variant="h6">Detalhes do Técnico</Typography>
      </DialogTitle>

      <Tabs
        value={tab}
        onChange={handleChangeTab}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        sx={{ px: 1, mb: 1 }}
      >
        <Tab icon={<InfoCircleOutlined />} iconPosition="start" label="Resumo" />
        <Tab icon={<ToolOutlined />} iconPosition="start" label="Ferramentas" />
        <Tab icon={<DollarCircleOutlined />} iconPosition="start" label="Totais" />
        <Tab icon={<FileSearchOutlined />} iconPosition="start" label="Vistorias" />
      </Tabs>

      <DialogContent dividers sx={{ p: 1 }}>
        {tab === 0 && (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Informações do Técnico
            </Typography>
            <List disablePadding>
              <DetailItem icon={<InfoCircleOutlined />} label="Nome" value={dadosTecnico.nome} />
              <DetailItem icon={<InfoCircleOutlined />} label="Data de Cadastro" value={formatDateFriendly(dadosTecnico.createdAt)} />
              <DetailItem icon={<InfoCircleOutlined />} label="Última Atualização" value={formatDateFriendly(dadosTecnico.updatedAt)} />
              <DetailItem icon={<ToolOutlined />} label="Ferramentas Cadastradas" value={totalFerramentasCadastradas} />
              <DetailItem
                icon={<DollarCircleOutlined />}
                label="Ferramentas Perdidas"
                value={`R$ ${parseFloat(dadosTecnico.totalPerdido || 0).toFixed(2)}`}
              />
              <DetailItem icon={<DollarCircleOutlined />} label="Percentual Perdido" value={`${percentualPerdido}%`} divider={false} />
            </List>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Vistorias Realizadas: {vistorias.length}
            </Typography>
          </Paper>
        )}

        {tab === 1 && (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Ferramentas Ativas
            </Typography>
            {ferramentasAtivas.length > 0 ? (
              ferramentasAtivas.map((ferramenta) => (
                <Box key={ferramenta.id} sx={{ mb: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 1,
                      backgroundColor: '#f0f0f0',
                      cursor: 'pointer'
                    }}
                    onClick={() => toggleFerramenta(ferramenta.id)}
                  >
                    <Typography variant="subtitle1">{ferramenta.nome || `ID: ${ferramenta.id}`}</Typography>
                    <Box>{expandedFerramentas[ferramenta.id] ? <UpOutlined /> : <DownOutlined />}</Box>
                  </Box>
                  <Collapse in={expandedFerramentas[ferramenta.id]} timeout="auto" unmountOnExit>
                    <Box sx={{ p: 1 }}>
                      <Typography variant="body2">
                        <strong>Valor:</strong> R$ {parseFloat(ferramenta.valor).toFixed(2)}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Histórico de Tags:</strong>
                        </Typography>
                        {ferramenta.tags?.length ? (
                          <List sx={{ pl: 2, p: 0 }}>
                            {ferramenta.tags.map((tag) => (
                              <ListItem
                                key={tag.id}
                                disableGutters
                                sx={{
                                  backgroundColor: 'rgba(0, 0, 0, 0.03)',
                                  py: 0.3,
                                  px: 1,
                                  borderRadius: 1,
                                  mb: 0.5,
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                              >
                                <ListItemText
                                  primary={tag.tags}
                                  secondary={tag.dataHora ? `Data: ${new Date(tag.dataHora).toLocaleString('pt-BR')}` : ''}
                                  primaryTypographyProps={{ variant: 'caption' }}
                                  secondaryTypographyProps={{ variant: 'caption' }}
                                />
                                <IconButton
                                  size="small"
                                  onClick={() => handleVerVistoriaTag(tag.tags)}
                                  title="Ver Vistoria de origem desta tag"
                                >
                                  <EyeOutlined />
                                </IconButton>
                              </ListItem>
                            ))}
                          </List>
                        ) : (
                          <Typography variant="caption">Nenhuma tag</Typography>
                        )}
                      </Box>
                    </Box>
                  </Collapse>
                </Box>
              ))
            ) : (
              <Typography variant="body2">Nenhuma ferramenta ativa cadastrada.</Typography>
            )}

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Ferramentas Deletadas
            </Typography>
            {ferramentasDeletadas.length > 0 ? (
              ferramentasDeletadas.map((ferramenta) => (
                <Box key={ferramenta.id} sx={{ mb: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 1,
                      backgroundColor: '#f0f0f0',
                      cursor: 'pointer'
                    }}
                    onClick={() => toggleFerramenta(`del-${ferramenta.id}`)}
                  >
                    <Typography variant="subtitle1">{ferramenta.nome || `ID: ${ferramenta.id}`}</Typography>
                    <Box>{expandedFerramentas[`del-${ferramenta.id}`] ? <UpOutlined /> : <DownOutlined />}</Box>
                  </Box>
                  <Collapse in={expandedFerramentas[`del-${ferramenta.id}`]} timeout="auto" unmountOnExit>
                    <Box sx={{ p: 1 }}>
                      <Typography variant="body2">
                        <strong>Valor:</strong> R$ {parseFloat(ferramenta.valor).toFixed(2)}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Histórico de Tags:</strong>
                        </Typography>
                        {ferramenta.tags?.length ? (
                          <List sx={{ pl: 2, p: 0 }}>
                            {ferramenta.tags.map((tag) => (
                              <ListItem
                                key={tag.id}
                                disableGutters
                                sx={{
                                  backgroundColor: 'rgba(0, 0, 0, 0.03)',
                                  py: 0.3,
                                  px: 1,
                                  borderRadius: 1,
                                  mb: 0.5,
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                              >
                                <ListItemText
                                  primary={tag.tags}
                                  secondary={tag.dataHora ? `Data: ${new Date(tag.dataHora).toLocaleString('pt-BR')}` : ''}
                                  primaryTypographyProps={{ variant: 'caption' }}
                                  secondaryTypographyProps={{ variant: 'caption' }}
                                />
                                <IconButton
                                  size="small"
                                  onClick={() => handleVerVistoriaTag(tag.tags)}
                                  title="Ver Vistoria de origem desta tag"
                                >
                                  <EyeOutlined />
                                </IconButton>
                              </ListItem>
                            ))}
                          </List>
                        ) : (
                          <Typography variant="caption">Nenhuma tag</Typography>
                        )}
                      </Box>
                    </Box>
                  </Collapse>
                </Box>
              ))
            ) : (
              <Typography variant="body2">Nenhuma ferramenta deletada.</Typography>
            )}
          </Paper>
        )}

        {tab === 2 && (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <List disablePadding>
              <DetailItem
                icon={<DollarCircleOutlined />}
                label="Total Ferramentas Original"
                value={`R$ ${parseFloat(dadosTecnico.totalFerramentasOriginal || 0).toFixed(2)}`}
              />
              <DetailItem
                icon={<DollarCircleOutlined />}
                label="Total Perdido"
                value={`R$ ${parseFloat(dadosTecnico.totalPerdido || 0).toFixed(2)}`}
              />
              <DetailItem
                icon={<DollarCircleOutlined />}
                label="Total Ferramentas"
                value={`R$ ${parseFloat(dadosTecnico.totalFerramentas || 0).toFixed(2)}`}
                divider={false}
              />
            </List>
          </Paper>
        )}

        {tab === 3 && (
          <Paper variant="outlined" sx={{ p: 2 }}>
            {loadingVistorias ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : vistorias?.length ? (
              <List>
                {vistorias.map((vistoria) => (
                  <ListItem
                    key={vistoria.vistoria.id}
                    secondaryAction={
                      <IconButton edge="end" onClick={() => handleOpenVistoria(vistoria)}>
                        <EyeOutlined />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={`Vistoria #${vistoria.vistoria.id}`}
                      secondary={`Data: ${vistoria.vistoria.data_vistoria} - Status: ${vistoria.vistoria.status}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2">Nenhuma vistoria encontrada.</Typography>
            )}
          </Paper>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained">
          Fechar
        </Button>
      </DialogActions>

      {selectedVistoria && (
        <VerDetalhesVistoriaFerramentas open={modalVistoriaOpen} onClose={handleCloseVistoria} vistoria={selectedVistoria} />
      )}
    </Dialog>
  );
};

export default VerDetalhesTecnico;
