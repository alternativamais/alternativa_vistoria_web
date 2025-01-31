/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Grid,
  TextField,
  CircularProgress,
  Checkbox,
  FormControlLabel
} from '@mui/material';

const DadosOS = ({ formData, handleChange, vistoria }) => {
  const [isLoading, setIsLoading] = useState(false);

  const pegarCoordenadas = (campo) => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coordenadas = `${position.coords.latitude}, ${position.coords.longitude}`;
          handleChange({ target: { name: campo, value: coordenadas, checked: false } });
          setIsLoading(false);
        },
        (error) => {
          alert('Erro ao obter a localização: ' + error.message);
          setIsLoading(false);
        }
      );
    } else {
      alert('Geolocalização não é suportada pelo seu navegador.');
    }
  };

  return (
    <>
      <Box mb={1}>
        <Typography variant="h6" gutterBottom>
          Agendamento: {new Date(vistoria.dataAgendamento).toLocaleString('pt-BR')}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Tipo de Vistoria: {formData.tipoVistoria}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Nome do Cliente: {formData.nomeCliente}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Endereço do Cliente: {formData.enderecoCliente}
        </Typography>
      </Box>

      {formData.tipoVistoria === 'rede' ? (
        <Box mb={2}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={8}>
              <Typography variant="body1">Coordenadas CTO: {formData.coordenadasCto || 'Não disponível'}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Button variant="contained" color="primary" onClick={() => pegarCoordenadas('coordenadasCto')} fullWidth disabled={isLoading}>
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Obter'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Box mb={2}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={8}>
              <Typography variant="body1">
                Coordenadas do Endereço do Cliente: {formData.coordenadasEnderecoCliente || 'Não disponível'}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => pegarCoordenadas('coordenadasEnderecoCliente')}
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Obter'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}

      <TextField
        label="Resumo da Vistoria"
        name="resumoVistoria"
        value={formData.resumoVistoria || ''}
        onChange={handleChange}
        fullWidth
        multiline
        rows={3}
      />

      <TextField
        label="Metragem do Cabo"
        name="metragemCabo"
        type="number"
        value={formData.metragemCabo || ''}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <FormControl fullWidth>
        <InputLabel id="status-label" shrink={!!formData.status}>
          Status
        </InputLabel>
        <Select labelId="status-label" name="status" value={formData.status || ''} onChange={handleChange} displayEmpty>
          <MenuItem value="" disabled>
            <em>Selecione o status</em>
          </MenuItem>
          <MenuItem value="a vistoriar">A Vistoriar</MenuItem>
          <MenuItem value="pendente de agendamento">Pendente de Agendamento</MenuItem>
          <MenuItem value="correcao de instalacao">Correção de Instalação</MenuItem>
          <MenuItem value="cancelado">Cancelado</MenuItem>
          <MenuItem value="vistoriado">Vistoriado</MenuItem>
        </Select>
      </FormControl>

      <Box mt={2}>
        <FormControlLabel
          control={<Checkbox name="assinaturaEletronica" checked={formData.assinaturaEletronica || false} onChange={handleChange} />}
          label="Assinatura Eletrônica realizada"
        />
      </Box>
    </>
  );
};

export default DadosOS;
