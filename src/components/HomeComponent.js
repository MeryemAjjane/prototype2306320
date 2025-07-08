import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  textAlign: 'center',
  maxWidth: 800,
  margin: 'auto',
  marginTop: theme.spacing(4),
  backgroundColor: '#ffffff', // Fond blanc pour le Paper
}));

function HomeComponent() {
  return (
    <StyledPaper>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
        Bienvenue sur AutoBacklog Generator !
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
        Utilisez la barre latérale pour naviguer :
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 1 }}>
        - **Mes Projets** : Affichez et gérez tous vos projets existants.
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        - **Générateur PDF** : Importez un nouveau cahier des charges pour générer un backlog.
      </Typography>
    </StyledPaper>
  );
}

export default HomeComponent;
