/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Button, Typography, Box, Grid, CircularProgress, FormControlLabel, Checkbox } from '@mui/material';

const ClienteInfo = ({ formData, handleChange, vistoria }) => {
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
    <Box>
      <Box mb={2}>
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

      <Box mt={2}>
        <FormControlLabel
          control={<Checkbox name="assinaturaEletronica" checked={formData.assinaturaEletronica || false} onChange={handleChange} />}
          label="Assinatura Eletrônica realizada"
        />
      </Box>
    </Box>
  );
};

export default ClienteInfo;
