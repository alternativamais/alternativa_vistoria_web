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
  Grid
} from '@mui/material';
import { InfoCircleOutlined, FileSearchOutlined, CheckSquareOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { api } from 'services/api';

const VerDetalhesVistoria = ({ open, onClose, vistoria }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [imagens, setImagens] = useState([]);
  const navigate = useNavigate();

  const handleChangeTab = (event, newValue) => {
    setSelectedTab(newValue);
  };

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

  const renderDetail = (label, value) => (
    <Box sx={{ mb: 1 }}>
      <Typography variant="body2" color="text.secondary">
        <strong>{label}:</strong> {value || 'Não informado'}
      </Typography>
    </Box>
  );

  if (!vistoria) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="body" // Alteração para scroll na página inteira
      sx={{
        '& .MuiDialog-paper': {
          margin: { xs: 1, sm: 2 },
          width: '100%'
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }} />

      <Card
        elevation={0}
        sx={{
          mx: 3,
          mt: 1,
          mb: 2,
          backgroundColor: '#f5f5f5',
          borderRadius: 2
        }}
      >
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  position: 'relative',
                  width: 200,
                  height: 200,
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
                        borderRadius: '8px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        mb: 0
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
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Nenhuma imagem encontrada para esta vistoria.
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

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                <Typography variant="body2">
                  <strong>ID da Vistoria:</strong> {vistoria.id || 'N/D'}
                </Typography>
                <Typography variant="body2">
                  <strong>Status:</strong> {vistoria.status || 'N/D'}
                </Typography>
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
        sx={{ px: 2 }}
      >
        <Tab icon={<InfoCircleOutlined />} iconPosition="start" label="Informações Gerais" />
        <Tab icon={<FileSearchOutlined />} iconPosition="start" label="Dados Técnicos" />
        <Tab icon={<CheckSquareOutlined />} iconPosition="start" label="Status e Datas" />
      </Tabs>

      <DialogContent dividers>
        {selectedTab === 0 && (
          <Box>
            {renderDetail('Tipo de Vistoria', vistoria.tipoVistoria)}
            {renderDetail('Nome do Cliente', vistoria.nomeCliente)}
            {renderDetail('Endereço do Cliente', vistoria.enderecoCliente)}
          </Box>
        )}

        {selectedTab === 1 && (
          <Box>
            {renderDetail('Coordenadas da CTO', vistoria.coordenadasCto)}
            {renderDetail('Coordenadas do Endereço do Cliente', vistoria.coordenadasEnderecoCliente)}
            {renderDetail('Resumo da Vistoria', vistoria.resumoVistoria)}
            {renderDetail('Metragem do Cabo', vistoria.metragemCabo)}
          </Box>
        )}

        {selectedTab === 2 && (
          <Box>
            {renderDetail('Status', vistoria.status)}
            {renderDetail('Criação', vistoria.dataHoraCriacao)}
            {renderDetail('Agendamento', vistoria.dataAgendamento)}
            {renderDetail('Conclusão', vistoria.dataHoraConclusao)}
          </Box>
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
