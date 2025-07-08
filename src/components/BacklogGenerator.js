import React from 'react';
import { Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  marginBottom: theme.spacing(4),
}));

function BacklogGenerator({ onImportClick }) {
  return (
    <StyledPaper elevation={3} sx={{ textAlign: 'center', maxWidth: 768, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'extrabold', color: 'text.primary' }}>
        Bienvenue dans votre Gestionnaire de Projet Agile!
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
        Uploadez votre cahier des charges PDF pour générer automatiquement votre backlog.
      </Typography>
      <Button
        variant="contained"
        startIcon={<UploadFileIcon />}
        onClick={onImportClick}
        sx={{
          py: 2,
          px: 4,
          bgcolor: '#C7D9E5', // Indigo 700
          '&:hover': { bgcolor: '#C7D9E5' }, // Indigo 800
          fontSize: '1.125rem',
          color:'#2F4157',
          fontWeight: 'semibold',
        }}
      >
        Importer un nouveau Cahier des Charges
      </Button>
    </StyledPaper>
  );
}

export default BacklogGenerator;
