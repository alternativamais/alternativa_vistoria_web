import React from 'react';
import { Button, Grid, Typography, Card, CardContent } from '@mui/material';

const Dashboard = () => {
  // Mocked data
  const dashboardData = {
    totalCO2Reduzido: '120 toneladas',
    diferencaReducao: '15%',
    energiaRenovavelUsada: '450 MWh',
    projetosAtivos: 25,
    arvoresPlantadas: 800,
    comunidadesImpactadas: 12
  };

  // Card styles
  const cardStyles = {
    borderRadius: '16px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#eafaf1', // Verde claro
    border: '1px solid #c8e6c9' // Verde suave
  };

  // Typography styles
  const titleStyle = { fontWeight: 'bold', color: '#2e7d32' }; // Verde escuro
  const valueStyle = { fontSize: '24px', fontWeight: '600', color: '#388e3c' }; // Verde médio

  return (
    <Grid container rowSpacing={4} columnSpacing={2.75}>
      <Grid item xs={12}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: '#2e7d32',
            textAlign: 'center',
            marginBottom: '16px'
          }}
        >
          Painel de Sustentabilidade
        </Typography>
      </Grid>

      {/* Statistic cards */}
      {[
        { label: 'CO2 Reduzido', value: dashboardData.totalCO2Reduzido },
        { label: 'Energia Renovável Usada', value: dashboardData.energiaRenovavelUsada },
        { label: 'Projetos Ativos', value: dashboardData.projetosAtivos },
        { label: 'Árvores Plantadas', value: dashboardData.arvoresPlantadas },
        { label: 'Comunidades Impactadas', value: dashboardData.comunidadesImpactadas },
        { label: 'Taxa de Redução', value: dashboardData.diferencaReducao }
      ].map((item, index) => (
        <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
          <Card sx={cardStyles}>
            <CardContent>
              <Typography variant="subtitle1" sx={titleStyle}>
                {item.label}
              </Typography>
              <Typography variant="h5" sx={valueStyle}>
                {item.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}

      {/* Recent actions section */}
      <Grid item xs={12}>
        <Card sx={{ ...cardStyles, padding: '16px', backgroundColor: '#f1f8e9' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2e7d32', marginBottom: '8px' }}>
            Ações Recentes
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Colocar algo aqui
          </Typography>
        </Card>
      </Grid>

      {/* Buttons */}
      <Grid container justifyContent="center" spacing={2} sx={{ marginTop: '24px' }}>
        <Grid item xs={12} sm={6} md={3}>
          <Button fullWidth size="large" color="success" variant="contained" sx={{ borderRadius: '8px', backgroundColor: '#388e3c' }}>
            Gerar Relatório de Sustentabilidade
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button fullWidth size="large" color="secondary" variant="contained" sx={{ borderRadius: '8px', backgroundColor: '#7cb342' }}>
            Gerar Relatório XLSX
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
