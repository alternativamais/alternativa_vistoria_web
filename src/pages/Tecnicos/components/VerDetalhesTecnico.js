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
  Chip,
  Divider,
  Fade,
  Collapse
} from '@mui/material';
import { InfoCircleOutlined, DollarCircleOutlined, DownOutlined, UpOutlined, ToolOutlined } from '@ant-design/icons';

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

const VerDetalhesTecnico = ({ open, onClose, tecnico }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [expandedFerramentas, setExpandedFerramentas] = useState({});

  useEffect(() => {
    if (!open) {
      setSelectedTab(0);
      setExpandedFerramentas({});
    }
  }, [open]);

  const handleChangeTab = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const toggleFerramenta = (id) => {
    setExpandedFerramentas((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (!tecnico) return null;

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
        value={selectedTab}
        onChange={handleChangeTab}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        sx={{ px: 1, mb: 1 }}
      >
        <Tab icon={<InfoCircleOutlined />} iconPosition="start" label="Informações Gerais" />
        <Tab icon={<ToolOutlined />} iconPosition="start" label="Ferramentas" />
        <Tab icon={<DollarCircleOutlined />} iconPosition="start" label="Totais" />
      </Tabs>

      <DialogContent dividers sx={{ p: 1 }}>
        {selectedTab === 0 && (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <List disablePadding>
              <DetailItem icon={<InfoCircleOutlined />} label="Nome" value={tecnico.nome} />
              <DetailItem icon={<InfoCircleOutlined />} label="Criado Em" value={formatarDataHoraParaBrasil(tecnico.createdAt)} />
              <DetailItem
                icon={<InfoCircleOutlined />}
                label="Atualizado Em"
                value={formatarDataHoraParaBrasil(tecnico.updatedAt)}
                divider={false}
              />
            </List>
          </Paper>
        )}

        {selectedTab === 1 && (
          <Paper variant="outlined" sx={{ p: 2 }}>
            {tecnico.ferramentas && tecnico.ferramentas.length > 0 ? (
              tecnico.ferramentas.map((ferramenta) => (
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
                          <strong>Tags:</strong>
                        </Typography>
                        {ferramenta.tags && ferramenta.tags.length > 0 ? (
                          ferramenta.tags.map((tag) => <Chip key={tag.id} label={tag.tags} size="small" sx={{ mr: 0.5, mb: 0.5 }} />)
                        ) : (
                          <Typography variant="caption">Nenhuma tag</Typography>
                        )}
                      </Box>
                    </Box>
                  </Collapse>
                </Box>
              ))
            ) : (
              <Typography variant="body2">Nenhuma ferramenta cadastrada.</Typography>
            )}
          </Paper>
        )}

        {selectedTab === 2 && (
          <Paper variant="outlined" sx={{ p: 2 }}>
            <List disablePadding>
              <DetailItem
                icon={<DollarCircleOutlined />}
                label="Total Ferramentas Original"
                value={`R$ ${parseFloat(tecnico.totalFerramentasOriginal || 0).toFixed(2)}`}
              />
              <DetailItem
                icon={<DollarCircleOutlined />}
                label="Total Perdido"
                value={`R$ ${parseFloat(tecnico.totalPerdido || 0).toFixed(2)}`}
              />
              <DetailItem
                icon={<DollarCircleOutlined />}
                label="Total Ferramentas"
                value={`R$ ${parseFloat(tecnico.totalFerramentas || 0).toFixed(2)}`}
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

export default VerDetalhesTecnico;
