import React, { useState } from 'react';
import axios from 'axios';
import { Box, Alert, Toolbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

// Import des composants
// ASSUREZ-VOUS QUE CES CHEMINS SONT CORRECTS ET QUE LES FICHIERS EXISTENT DANS src/components/
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import UploadDialog from './components/UploadDialog';
import BacklogGenerator from './components/BacklogGenerator';
import BacklogDisplay from './components/BacklogDisplay';
import ProjectList from './components/ProjectList';
import HomeComponent from './components/HomeComponent';

// Custom styled Paper (utilisé par plusieurs composants)
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  marginBottom: theme.spacing(4),
}));

// Utility functions for colors (peuvent être déplacées dans un fichier utils.js si souhaité)
const getPriorityColor = (priority) => {
  switch (priority.toLowerCase()) {
    case 'high':
      return { bgcolor: '#ef4444', color: 'white' }; // Rouge 500
    case 'medium':
      return { bgcolor: '#eab308', color: 'white' }; // Jaune 500
    case 'low':
      return { bgcolor: '#22c55e', color: 'white' }; // Vert 500
    default:
      return { bgcolor: '#9ca3af', color: 'white' }; // Gris 400
  }
};

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'todo':
      return { bgcolor: '#6b7280', color: 'white' }; // Gris 500
    case 'in progress':
      return { bgcolor: '#3b82f6', color: 'white' }; // Bleu 500
    case 'done':
      return { bgcolor: '#16a34a', color: 'white' }; // Vert 600
    default:
      return { bgcolor: '#9ca3af', color: 'white' }; // Gris 400
  }
};


function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [backlogData, setBacklogData] = useState(null); // Backlog du projet actuellement affiché
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [activeView, setActiveView] = useState('home'); // Vue par défaut: 'home'
  const [currentProjectName, setCurrentProjectName] = useState('Project'); // Nom du projet affiché dans le header
  const [selectedProjectId, setSelectedProjectId] = useState(null); // ID du projet actuellement sélectionné

  /**
   * Fonction pour charger un backlog spécifique depuis le backend.
   * Cette fonction est appelée lorsqu'un utilisateur clique sur un projet dans la liste.
   * @param {number} projectId - L'ID du projet à charger.
   * @param {string} projectName - Le nom du projet (pour l'affichage dans le header).
   */
  const fetchBacklogForProject = async (projectId, projectName) => {
    setIsLoading(true);
    setError(null);
    try {
      // APPEL CORRIGÉ AU BACKEND :
      // Nous appelons maintenant l'endpoint du ProjectController qui renvoie un ProjectDTO complet.
      // Cet appel GET /api/projects/{id} DOIT retourner un ProjectDTO
      // qui contient TOUTES les données du backlog (backlogItems, assignments, executionPlan)
      // telles que générées par l'analyse PDF.
      const response = await axios.get(`http://localhost:8080/api/projects/${projectId}`);
      
      // Assurez-vous que la structure de response.data correspond à ce que BacklogDisplay attend
      // C'est-à-dire : { id, projectName, createdAt, updatedAt, backlogItems, assignments, executionPlan }
      // BacklogDisplay attend un champ 'backlog' (pour backlogItems), 'assignments', 'execution_plan'
      // Il faut donc mapper les noms de champs du ProjectDTO si nécessaire.
      setBacklogData({
        project: response.data.projectName, // Utilise projectName du DTO
        backlog: response.data.backlogItems || [], // Assurez-vous que backlogItems est bien une liste
        assignments: response.data.assignments || {},
        execution_plan: response.data.executionPlan || {},
        // Ajoutez d'autres champs si BacklogDisplay les utilise et qu'ils sont dans votre ProjectDTO
      });

      setCurrentProjectName(projectName);
      setSelectedProjectId(projectId);
      setActiveView('backlog'); // Passe à la vue du backlog
    } catch (err) {
      console.error(`Erreur lors du chargement du backlog du projet ${projectId}:`, err);
      if (err.response && err.response.status === 404) {
        setError("Projet introuvable. Veuillez vérifier l'ID du projet dans la base de données.");
      } else if (err.request) {
        setError("Impossible de joindre le backend. Vérifiez qu'il est démarré et que CORS est configuré correctement.");
      } else {
        setError(`Erreur: ${err.message}`);
      }
      setBacklogData(null); // Efface les données précédentes en cas d'erreur
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction appelée quand un projet est sélectionné depuis la ProjectList
  const handleProjectSelection = (projectId, projectName) => {
    fetchBacklogForProject(projectId, projectName);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setError(null);
  };

  /**
   * Gère l'upload du fichier vers le backend pour analyse et sauvegarde/mise à jour du projet.
   */
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
      // 1. Appel au backend pour analyser le PDF et obtenir le backlog généré
      const analyzeResponse = await axios.post('http://localhost:8080/api/backlog/uploadpdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const generatedBacklog = analyzeResponse.data; // Contient project, backlog, assignments, execution_plan

      // 2. Préparer les données du projet à sauvegarder/mettre à jour dans la base de données
      // Ces champs doivent correspondre à votre ProjectDTO côté Spring Boot
      const projectToSave = {
        id: selectedProjectId, // Sera null si c'est un nouveau projet, sinon l'ID du projet à mettre à jour
        projectName: generatedBacklog.project, // Nom du projet extrait du PDF
        // Assurez-vous que ces champs existent dans votre ProjectDTO
        // et que votre service/contrôleur Spring Boot sait les gérer.
        description: "Backlog généré via PDF.", // Exemple de description
        status: "Généré", // Exemple de statut
        // Les dates createdAt et updatedAt seront gérées par Spring Boot avec @CreationTimestamp/@UpdateTimestamp
        
        // Les données du backlog générées par l'analyse PDF
        backlogItems: generatedBacklog.backlog,
        assignments: generatedBacklog.assignments,
        executionPlan: generatedBacklog.execution_plan,
      };

      let saveResponse;
      if (selectedProjectId) {
        // Si un projet est déjà sélectionné (re-analyse ou mise à jour), on utilise PUT
        // L'ID est inclus dans l'URL et le corps de la requête
        saveResponse = await axios.post(`http://localhost:8080/api/backlog/uploadpdf`, projectToSave);
      } 
      
      // Après sauvegarde/mise à jour, mettez à jour l'état de l'application
      setBacklogData({
        project: saveResponse.data.project,
        backlog: saveResponse.data.backlog || [],
        assignments: saveResponse.data.assignments || {},
        execution_plan: saveResponse.data.executionPlan || {},
      });
      console.log("Projet sauvegardé/mis à jour:", saveResponse.data);
      setOpenDialog(false);
      setSelectedFile(null);
      setCurrentProjectName(saveResponse.data.projectName); // Met à jour le nom dans le header
      setSelectedProjectId(saveResponse.data.id); // Met à jour l'ID du projet sélectionné
      setActiveView('backlog'); // Affiche le backlog du projet fraîchement sauvegardé/mis à jour

    } catch (err) {
      console.error("Erreur lors de l'analyse ou de la sauvegarde du projet:", err);
      if (err.response) {
        setError(`Erreur du serveur: ${err.response.status} - ${err.response.data.message || 'Une erreur est survenue lors de l\'analyse ou de la sauvegarde.'}`);
      } else if (err.request) {
        setError("Impossible de joindre le backend Spring Boot. Vérifiez qu'il est démarré et que CORS est configuré.");
      } else {
        setError(`Erreur: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Ouvre la modale d'upload et prépare l'état pour un nouveau projet ou une re-analyse.
   * @param {boolean} isNewProject - Vrai si l'on initie la création d'un tout nouveau projet.
   */
  const startNewUploadFlow = (isNewProject = false) => {
    setSelectedFile(null);
    setError(null);
    setOpenDialog(true);
    setActiveView('generator'); // S'assure que l'onglet Générateur est actif
    if (isNewProject) {
      setSelectedProjectId(null); // Réinitialise l'ID si c'est un nouveau projet
      setCurrentProjectName('Nouveau Projet');
      setBacklogData(null); // Efface le backlog précédent
    }
  };

  const drawerWidth = 240;

  return (
    <Box sx={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
      <Header projectName={currentProjectName} drawerWidth={drawerWidth} />
      <Sidebar activeView={activeView} setActiveView={setActiveView} drawerWidth={drawerWidth} />

      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px`, bgcolor: '#f8f8f8', overflowY: 'auto' }}>
        <Toolbar /> {/* Espace pour l'AppBar */}

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* Conditionnement de l'affichage des vues */}
        {activeView === 'home' && <HomeComponent />}

        {activeView === 'projects' && (
          <ProjectList
            onOpenGeneratorClick={() => startNewUploadFlow(true)} // 'Nouveau Projet' crée un nouveau projet
            onProjectSelect={handleProjectSelection} // Gère le clic sur un projet existant
          />
        )}

        {activeView === 'generator' && (
          <BacklogGenerator
            onImportClick={() => setOpenDialog(true)} // Ouvre la modale pour l'analyse
          />
        )}

        {activeView === 'backlog' && (
          <BacklogDisplay
            backlogData={backlogData}
            onNewUploadClick={() => startNewUploadFlow(true)} // 'Upload nouveau' crée aussi un nouveau projet
            getPriorityColor={getPriorityColor}
            getStatusColor={getStatusColor}
          />
        )}
      </Box>

      <UploadDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
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
