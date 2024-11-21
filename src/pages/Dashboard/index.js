import React from 'react';
import { Grid, Typography } from '@mui/material';

const Dashboard = () => {
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
          Painel
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
