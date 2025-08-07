import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AppBar, Toolbar, Typography, Box, Alert, Stack, IconButton
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Sidebar from './components/Sidebar';
import UploadDialog from './components/UploadDialog';
import ProjectList from './components/ProjectList';
import BacklogDisplay from './components/BacklogDisplay';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [backlogData, setBacklogData] = useState(null);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [activeView, setActiveView] = useState('home');

  const drawerWidth = 240;

  //  ouvrir la modale si activeView === 'generator'
  useEffect(() => {
    if (activeView === 'generator') {
      setOpenDialog(true);
    }
  }, [activeView]);

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Veuillez sélectionner un fichier PDF.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post('http://localhost:8080/api/backlog/uploadpdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setBacklogData(response.data);
      console.log("Backlog généré:", response.data);
      setOpenDialog(false);
      setSelectedFile(null);

      // rediriger vers backlog automatiquement
      setActiveView('backlog');
    } catch (err) {
      console.error("Erreur:", err);
      if (err.response) {
        setError(`Erreur serveur: ${err.response.status} - ${err.response.data.message || 'Une erreur est survenue.'}`);
      } else if (err.request) {
        setError("Impossible de joindre le serveur.");
      } else {
        setError(`Erreur: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setBacklogData(null);
    setError(null);
  };
  // Fonction corrigée pour gérer la sélection de projet
const handleProjectSelect = async (id, name) => {
  setIsLoading(true);
  setError(null);
  try {
    const res = await axios.get(`http://localhost:8080/api/projects/${id}`);
    
    // Maintenant la réponse contient toutes les données nécessaires
    setBacklogData({
      project: res.data.projectName,
      backlog: res.data.backlogItems || [],
      assignments: res.data.assignments || {},
      execution_plan: res.data.executionPlan || {},
    });
    
    setActiveView('backlog');
  } catch (err) {
    console.error("Erreur lors du chargement du projet:", err);
    setError("Erreur pendant le chargement du projet.");
  } finally {
    setIsLoading(false);
  }
};



  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: 'white',
          color: 'text.primary',
        }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src="https://placehold.co/32x32/1a73e8/ffffff?text=AD" alt="Logo" style={{ marginRight: 12 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              AutoBacklog Generator
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Stack direction="row" spacing={2}>
            <IconButton><NotificationsIcon /></IconButton>
            <IconButton><AccountCircleIcon /></IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      <Sidebar activeView={activeView} setActiveView={setActiveView} drawerWidth={drawerWidth} />

      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px`, bgcolor: '#f8f8f8' }}>
        <Toolbar />
        {error && <Alert severity="error">{error}</Alert>}

        {activeView === 'projects' && (
         <ProjectList
    onOpenGeneratorClick={() => setActiveView('generator')}
    onProjectSelect={handleProjectSelect}
  />
        )}

       {activeView === 'backlog' && backlogData && (
  <BacklogDisplay
    backlogData={backlogData}
    onNewUploadClick={() => setActiveView('generator')}
  />
)}


        {activeView === 'home' && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Bienvenue dans AutoBacklog
            </Typography>
            <Typography variant="body1">
              Choisissez une option dans le menu pour commencer.
            </Typography>
          </Box>
        )}
      </Box>

      <UploadDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          if (activeView === 'generator') setActiveView('home');
        }}
        selectedFile={selectedFile}
        handleFileChange={handleFileChange}
        isLoading={isLoading}
        handleUpload={handleUpload}
        error={error}
      />
    </Box>
  );
}

export default App;
