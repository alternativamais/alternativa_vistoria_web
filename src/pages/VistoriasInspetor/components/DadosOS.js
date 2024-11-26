/* eslint-disable react/prop-types */
import React from 'react';
import { Button, Select, MenuItem, FormControl, InputLabel, Typography, Box, Grid, TextField } from '@mui/material';

const DadosOS = ({ formData, handleChange }) => {
  console.log('formData.tipoVistoriaformData.tipoVistoria', formData.tipoVistoria);
  // Função para capturar as coordenadas de localização
  const pegarCoordenadas = (campo) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coordenadas = `${position.coords.latitude}, ${position.coords.longitude}`;
          handleChange({ target: { name: campo, value: coordenadas } });
        },
        (error) => {
          alert('Erro ao obter a localização: ' + error.message);
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
              <Button variant="contained" color="primary" onClick={() => pegarCoordenadas('coordenadasCto')} fullWidth>
                Obter
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
              <Button variant="contained" color="primary" onClick={() => pegarCoordenadas('coordenadasEnderecoCliente')} fullWidth>
                Obter
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}

      <TextField
        label="Resumo da Vistoria"
        name="resumoVistoria"
        value={formData.resumoVistoria}
        onChange={handleChange}
        fullWidth
        multiline
        rows={3}
      />

      <FormControl fullWidth>
        <InputLabel id="status-label">Status</InputLabel>
        <Select labelId="status-label" name="status" value={formData.status} onChange={handleChange}>
          <MenuItem value="aberta">Aberta</MenuItem>
          <MenuItem value="fechada">Fechada</MenuItem>
          <MenuItem value="pendente">Pendente</MenuItem>
        </Select>
      </FormControl>
    </>
  );
};

export default DadosOS;
