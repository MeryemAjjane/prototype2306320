import React from 'react';
import { Box, Typography, Paper } from '@mui/material';



function HomeComponent() {
  return (
    // cadre centrer et personaliser, Paper est une feuille de papier avec un ombre 
      <Paper
      sx={{
        p: 4,
        borderRadius: 2,
        boxShadow: 3,
        textAlign: 'center',
        maxWidth: 800,
        m: 'auto',
        mt: 4,
        bgcolor: '#fff',
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
        Bienvenue sur AutoBacklog Generator !
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
        Utilisez la barre latérale pour naviguer :
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
        - Mes Projets : Affichez et gérez tous vos projets existants.
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        - Générateur PDF : Importez un nouveau cahier des charges pour générer un backlog.
      </Typography>
   </Paper>
  );
}

export default HomeComponent;
