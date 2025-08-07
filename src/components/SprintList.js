import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  marginBottom: theme.spacing(4),
}));

// 🔄 Composant qui affiche la liste des sprints du projet actuel
function SprintList({ projectId, onSprintClick }) {
  const [sprints, setSprints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectId) return; // Si aucun projet sélectionné, on ne fait rien

    const fetchSprints = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(`http://localhost:8080/api/projects/${projectId}/sprints`);
        setSprints(response.data);
      } catch (err) {
        console.error('Erreur lors du chargement des sprints:', err);
        if (err.response) {
          setError(`Erreur serveur: ${err.response.status} - ${err.response.data.message || 'Erreur inconnue.'}`);
        } else if (err.request) {
          setError("Le serveur ne répond pas.");
        } else {
          setError(`Erreur: ${err.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSprints();
  }, [projectId]);

  return (
    <StyledPaper elevation={3}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Sprints du projet
        </Typography>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>Chargement des sprints...</Typography>
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : sprints.length === 0 ? (
        <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
          Aucun sprint disponible pour ce projet.
        </Typography>
      ) : (
        <List>
          {sprints.map((sprint, index) => (
            <React.Fragment key={sprint.id}>
              <ListItem disablePadding>
                <ListItemButton onClick={() => onSprintClick && onSprintClick(sprint)}>
                  <ListItemIcon>
                    <FolderOpenIcon sx={{ color: '#4f46e5' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={sprint.name}
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {sprint.startDate} → {sprint.endDate} | Statut: {sprint.status}
                      </Typography>
                    }
                    primaryTypographyProps={{ fontWeight: 'medium' }}
                  />
                </ListItemButton>
              </ListItem>
              {index < sprints.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      )}
    </StyledPaper>
  );
}

export default SprintList;
