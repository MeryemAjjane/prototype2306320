import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  CircularProgress,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  marginBottom: theme.spacing(4),
}));

function ProjectList({ onOpenGeneratorClick, onProjectSelect }) {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fonction pour récupérer les projets depuis le backend
  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://localhost:8080/api/projects/listProjects');
      setProjects(response.data);
    } catch (err) {
      console.error('Error loading projects:', err);
      // Detailed error handling for network issues
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(`Server error: ${err.response.status} - ${err.response.data.message || 'Unable to load projects.'}`);
      } else if (err.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        setError("Unable to reach the server. Please ensure your backend is running at http://localhost:8080 and CORS is correctly configured.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`Error: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // This useEffect runs once on component mount to load projects
  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <StyledPaper elevation={3}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          My Projects
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={onOpenGeneratorClick} // This function is passed by App.js to open the upload modal
          sx={{ bgcolor: '#4338ca', '&:hover': { bgcolor: '#3730a3' } }}
        >
          New Project
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2, color: 'text.secondary' }}>Loading projects...</Typography>
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      ) : projects.length === 0 ? (
        <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
          No projects found. Create a new one to get started!
        </Typography>
      ) : (
        <List>
          {projects.map((project, index) => (
            <React.Fragment key={project.id}>
              <ListItem disablePadding>
                <ListItemButton onClick={() => onProjectSelect(project.id, project.projectName)}>
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
