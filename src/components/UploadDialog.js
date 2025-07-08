import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Input,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function UploadDialog({
  open,
  onClose,
  selectedFile,
  handleFileChange,
  isLoading,
  handleUpload,
  error,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Importer un fichier PDF
        </Typography>
        <IconButton aria-label="close" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
            Sélectionner un fichier :
          </Typography>
          <Input
            type="file"
            inputProps={{ accept: ".pdf" }}
            onChange={handleFileChange}
            fullWidth
            sx={{
              '& .MuiInputBase-input': {
                padding: '8px 12px',
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
                fontWeight: 'semibold',
                bgcolor: '#e0e7ff', // Indigo 50
                color: '#4f46e5', // Indigo 700
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: '#c7d2fe', // Indigo 100
                }
              }
            }}
          />
          {selectedFile && (
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
              Fichier sélectionné: <Typography component="span" variant="inherit" sx={{ fontWeight: 'medium' }}>{selectedFile.name}</Typography>
            </Typography>
          )}
        </Box>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={handleUpload}
          disabled={isLoading || !selectedFile}
          variant="contained"
          sx={{
            width: '100%',
            py: 1.5,
            bgcolor: isLoading ? 'grey.400' : '#F5EFEB', // Green 600
            '&:hover': { bgcolor: isLoading ? 'grey.400' : '#F5EFEB' }, // Green 700
            fontSize: '1rem',
            fontWeight: 'semibold',
            color:'#2F4157'
          }}
        >
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
