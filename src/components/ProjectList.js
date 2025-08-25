import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import axios from 'axios'; // Import axios
import {
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  CircularProgress, // For loading indicator
  Alert, // For error display
  Stack,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import ListAltIcon from '@mui/icons-material/ListAlt';

// Custom styled Paper for sections
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  marginBottom: theme.spacing(4),
}));

function ProjectList({ onOpenGeneratorClick, onProjectSelect, onKanbanClick }) {
  const [projects, setProjects] = useState([]); // State to store fetched projects
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null); // Clear any previous errors

      try {
        const response = await axios.get('http://localhost:8080/api/projects/listProjects'); // backend API endpoint
        // Assuming ProjectDTO has id, name, description, lastModified, status
        setProjects(response.data);
      } catch (err) {
        console.error('Erreur lors du chargement des projets:', err);
        if (err.response) {
          setError(`Erreur du serveur: ${err.response.status} - ${err.response.data.message || 'Impossible de charger les projets.'}`);
        } else if (err.request) {
          setError("Impossible de joindre le serveur. Vérifiez que le backend est démarré et que CORS est configuré.");
        } else {
          setError(`Erreur: ${err.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects(); // Call the fetch function when the component mounts
  }, []); // Empty dependency array means this runs once on mount

  // Fonction pour gérer le clic sur le bouton Backlog
  const handleBacklogClick = (e, project) => {
    e.stopPropagation(); // Empêche la propagation vers le ListItemButton
    onProjectSelect(project.id, project.projectName);
  };

  // Fonction pour gérer le clic sur le bouton Kanban
  const handleKanbanClick = (e, project) => {
    e.stopPropagation(); // Empêche la propagation vers le ListItemButton
    if (onKanbanClick) {
      onKanbanClick(project.id, project.projectName);
    }
  };

  return (
    <StyledPaper elevation={3}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Mes Projets
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={onOpenGeneratorClick}
          sx={{ bgcolor: '#4338ca', '&:hover': { bgcolor: '#3730a3' } }}
        >
          Nouveau Projet
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2, color: 'text.secondary' }}>Chargement des projets...</Typography>
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      ) : projects.length === 0 ? (
        <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
          Aucun projet trouvé. Créez-en un nouveau pour commencer !
        </Typography>
      ) : (
        <List>
          {projects.map((project, index) => (
            <React.Fragment key={project.id}>
              <ListItem disablePadding>
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                  {/* Zone principale cliquable du projet */}
                  <ListItemButton 
                    sx={{ flexGrow: 1, mr: 2 }}
                    onClick={() => onProjectSelect(project.id, project.projectName)}
                  >
                    <ListItemIcon>
                      <FolderOpenIcon sx={{ color: '#4f46e5' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={project.projectName}
                      secondary={
                        <Box component="span" sx={{ display: 'block', color: 'text.secondary', fontSize: '0.875rem' }}>
                          <Typography component="span" variant="body2" sx={{ fontSize: '0.75rem', color: 'text.disabled', mt: 0.5 }}>
                            Last modified: {new Date(project.updatedAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                      primaryTypographyProps={{ fontWeight: 'medium', fontSize: '1.1rem' }}
                    />
                  </ListItemButton>
                  
                  {/* Boutons d'action */}
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<ListAltIcon />}
                      onClick={(e) => handleBacklogClick(e, project)}
                      sx={{
                        borderColor: '#10b981',
                        color: '#10b981',
                        '&:hover': {
                          borderColor: '#059669',
                          bgcolor: '#f0fdf4'
                        }
                      }}
                    >
                      Backlog
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<ViewKanbanIcon />}
                      onClick={(e) => handleKanbanClick(e, project)}
                      sx={{
                        borderColor: '#f59e0b',
                        color: '#f59e0b',
                        '&:hover': {
                          borderColor: '#d97706',
                          bgcolor: '#fffbeb'
                        }
                      }}
                    >
                      Sprints
                    </Button>
                  </Stack>
                </Box>
              </ListItem>
              {index < projects.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      )}
    </StyledPaper>
  );
}

export default ProjectList;