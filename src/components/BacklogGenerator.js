import React from 'react';
import { Typography, Button, Paper } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

function BacklogGenerator({ onImportClick }) {
  return (
    <Paper
      elevation={3}
      sx={{
        textAlign: 'center',
        maxWidth: 768,
        mx: 'auto', // center horizontally
        mt: 4, 
        p: 3, 
        borderRadius: 2,
        boxShadow: 3,
        mb: 4
      }}
    >
      {/* Titre */}
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: 'bold', color: 'text.primary' }}
      >
        Bienvenue dans votre Gestionnaire de Projet Agile !
      </Typography>

      <Typography sx={{ color: 'text.secondary', mb: 4 }}>
        Uploadez votre cahier des charges PDF pour générer automatiquement votre backlog.
      </Typography>

      {/* Bouton */}
      <Button
        variant="contained"
        startIcon={<UploadFileIcon />}
        onClick={onImportClick}
        sx={{
          py: 2,
          px: 4,
          bgcolor: '#C7D9E5',
          color: '#2F4157',
          fontWeight: 'bold',
          '&:hover': { bgcolor: '#B0CFE0' }
        }}
      >
        Importer un nouveau Cahier des Charges
      </Button>
    </Paper>
  );
}

export default BacklogGenerator;
