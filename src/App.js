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
import SprintList from './components/SprintList';
import BacklogEditModal from './components/BacklogEditModal';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [backlogData, setBacklogData] = useState(null);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [activeView, setActiveView] = useState('home');
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedProjectName, setSelectedProjectName] = useState(null); // Ajouté pour stocker le nom du projet
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // Item to edit, null for new item
  const [modalError, setModalError] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const drawerWidth = 240;

  // Ouvrir la modale si activeView === 'generator'
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
      
      setBacklogData({
        project: res.data.projectName,
        backlog: res.data.backlogItems || [],
        assignments: res.data.assignments || {},
        execution_plan: res.data.executionPlan || {},
      });

      setSelectedProjectId(id);
      setSelectedProjectName(name);
      setActiveView('backlog');
    } catch (err) {
      console.error("Erreur lors du chargement du projet:", err);
      setError("Erreur pendant le chargement du projet.");
    } finally {
      setIsLoading(false);
    }
  };

  // Nouvelle fonction pour gérer la navigation vers le Kanban
  const handleKanbanClick = (projectId, projectName) => {
    setSelectedProjectId(projectId);
    setSelectedProjectName(projectName);
    setActiveView('kanban');
  };

  const handleUpdateBacklogItem = async (id, updatedItemData) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/backlog/updateBacklog/${id}`, updatedItemData);
      console.log("Backlog item mis à jour:", response.data);

      // Mettre à jour l'état local du backlog
      setBacklogData(prevData => {
        const updatedBacklog = prevData.backlog.map(item =>
          item.id === id ? response.data : item
        );
        return { ...prevData, backlog: updatedBacklog };
      });
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'élément de backlog:", err);
      let errorMessage = "Erreur lors de la mise à jour de l'élément.";
      if (err.response) {
        errorMessage = `Erreur du serveur: ${err.response.status} - ${err.response.data.message || 'Une erreur est survenue.'}`;
      } else if (err.request) {
        errorMessage = "Impossible de joindre le backend. Vérifiez qu'il est démarré.";
      } else {
        errorMessage = `Erreur: ${err.message}`;
      }
      setError(errorMessage);
      throw new Error(errorMessage); // Re-throw to be caught by modal
    }
  };

  // Fonction pour ouvrir le modal d'édition/création pour un nouvel élément
  const handleOpenCreateModal = () => {
    setEditingItem(null); // Indique que c'est un nouvel élément
    setIsEditModalOpen(true);
    setModalError(null);
  };

  // Fonction pour gérer la sauvegarde (création ou mise à jour) depuis le modal
  const handleSaveItem = async (itemData) => {
    setModalLoading(true);
    setModalError(null);
    try {
      if (itemData.id) {
        // C'est une mise à jour
        await handleUpdateBacklogItem(itemData.id, itemData);
      } else {
        // C'est une création
        await handleCreateBacklogItem(itemData);
      }
      setIsEditModalOpen(false);
      setEditingItem(null); // Réinitialiser après sauvegarde
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'élément:", error);
      setModalError(error.message || "Erreur lors de la sauvegarde de l'élément.");
    } finally {
      setModalLoading(false);
    }
  };

  // Création d'un nouvel élément de backlog via l'API.
  const handleCreateBacklogItem = async (newItemData) => {
    if (!selectedProjectId) {
      const msg = "Impossible de créer un élément de backlog sans un projet sélectionné.";
      setError(msg);
      throw new Error(msg);
    }
    try {
      // L'ID sera généré par le backend s'il n'est pas fourni.
      const response = await axios.post(`http://localhost:8080/api/backlog/project/${selectedProjectId}/addBacklog`, newItemData);
      console.log("Nouvel élément de backlog créé:", response.data);

      // Mettre à jour l'état local du backlog en ajoutant le nouvel élément
      setBacklogData(prevData => ({
        ...prevData,
        backlog: [...(prevData.backlog || []), response.data]
      }));
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Erreur lors de la création de l'élément de backlog:", err);
      let errorMessage = "Erreur lors de la création de l'élément.";
      if (err.response) {
        errorMessage = `Erreur du serveur: ${err.response.status} - ${err.response.data.message || 'Une erreur est survenue.'}`;
      } else if (err.request) {
        errorMessage = "Impossible de joindre le backend. Vérifiez qu'il est démarré.";
      } else {
        errorMessage = `Erreur: ${err.message}`;
      }
      setError(errorMessage);
      throw new Error(errorMessage); // Re-throw to be caught by modal
    }
  };

  // Gère la suppression d'un élément de backlog via l'API.
  const handleDeleteBacklogItem = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/backlog/deleteBacklog/${id}`);
      console.log("Backlog item supprimé:", id);

      // Mettre à jour l'état local du backlog en filtrant l'élément supprimé
      setBacklogData(prevData => {
        const updatedBacklog = prevData.backlog.filter(item => item.id !== id);
        return { ...prevData, backlog: updatedBacklog };
      });
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Erreur lors de la suppression de l'élément de backlog:", err);
      let errorMessage = "Erreur lors de la suppression de l'élément.";
      if (err.response) {
        errorMessage = `Erreur du serveur: ${err.response.status} - ${err.response.data.message || 'Une erreur est survenue.'}`;
      } else if (err.request) {
        errorMessage = "Impossible de joindre le backend. Vérifiez qu'il est démarré.";
      } else {
        errorMessage = `Erreur: ${err.message}`;
      }
      setError(errorMessage);
      throw new Error(errorMessage); // Re-throw to be caught by component
    }
  };

  // Préparer les options pour le Parent ID dropdown
  const parentOptions = (backlogData?.backlog || [])
    .filter(item => item.id !== editingItem?.id) // Exclure l'élément en cours d'édition
    .map(item => ({ id: item.id, title: item.title }));

  // Fonction pour ouvrir le modal de modification avec les données existantes
  const handleEditBacklogItem = (item) => {
    setEditingItem(item);         // On remplit les infos dans la modale
    setIsEditModalOpen(true);     // On affiche la modale
    setModalError(null);          // Réinitialise l'erreur
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
            onKanbanClick={handleKanbanClick}
          />
        )}

        {activeView === 'backlog' && backlogData && (
          <BacklogDisplay
            backlogData={backlogData}
            onNewUploadClick={() => setActiveView('generator')}
            onUpdateBacklogItem={handleUpdateBacklogItem}
            onDeleteBacklogItem={handleDeleteBacklogItem}
            onCreateBacklogItem={handleOpenCreateModal}
            onEditBacklogItem={handleEditBacklogItem}
          />
        )}

        {/* Nouvelle vue Kanban */}
        {activeView === 'kanban' && selectedProjectId && (
          <SprintList
            projectId={selectedProjectId}
            projectName={selectedProjectName}
            onSprintClick={(sprint) => {
              console.log('Sprint sélectionné :', sprint);
              // Vous pouvez ajouter ici la navigation vers un tableau Kanban détaillé
            }}
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

      {/* Modal de modification / création */}
      {isEditModalOpen && (
        <BacklogEditModal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          item={editingItem} // Sera null pour une création
          onSave={handleSaveItem} // Gère la création et la mise à jour
          isLoading={modalLoading}
          error={modalError}
          sprintNames={backlogData?.backlog ? Array.from(new Set(backlogData.backlog.map(item => item.suggestedSprintName).filter(name => name && name !== 'Non planifié'))) : []}
          agentOptions={backlogData?.backlog ? Array.from(new Set(backlogData.backlog.map(item => item.assignedAgent).filter(agent => agent && agent !== 'Unassigned'))) : []}
          parentOptions={parentOptions}
        />
      )}
    </Box>
  );
}

export default App;