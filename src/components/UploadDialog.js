import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, Input, CircularProgress,
  Alert, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function UploadDialog({
  open, onClose, selectedFile, handleFileChange,
  isLoading, handleUpload, error
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      
      {/* En-tête du Dialog */}
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Importer un fichier PDF
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Contenu du Dialog */}
      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          
          {/* Label */}
          <Typography sx={{ fontWeight: 'bold', mb: 1 }}>
            Sélectionner un fichier :
          </Typography>

          {/* Input fichier */}
          <Input
            type="file"
            inputProps={{ accept: ".pdf" }}
            onChange={handleFileChange}
            fullWidth
            sx={{
              '& .MuiInputBase-input': {
                p: '8px 12px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                bgcolor: '#f8f8f8',
              },
              '& .MuiInputBase-input::file-selector-button': {
                mr: '16px',
                p: '8px 16px',
                borderRadius: '9999px',
                border: 0,
                fontSize: '0.875rem',
                fontWeight: 'bold',
                bgcolor: '#e0e7ff',
                color: '#4f46e5',
                cursor: 'pointer',
                '&:hover': { bgcolor: '#c7d2fe' },
              }
            }}
          />

          {/* Affiche le nom du fichier sélectionné */}
          {selectedFile && (
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
              Fichier sélectionné : <strong>{selectedFile.name}</strong>
            </Typography>
          )}
        </Box>

        {/* Affiche une erreur s'il y'a */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>

      {/* Bouton d’action */}
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={handleUpload}
          disabled={isLoading || !selectedFile}
          variant="contained"
          sx={{
            width: '100%',
            py: 1.5,
            bgcolor: isLoading ? 'grey.400' : '#F5EFEB',
            '&:hover': { bgcolor: isLoading ? 'grey.400' : '#e0ddd8' },
            color: '#2F4157',
            fontWeight: 'bold'
          }}
        >
          {/* Loader pendant l’envoi */}
          {isLoading ? (
            <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
          ) : (
            'Analyser Cahier des Charges'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UploadDialog;
