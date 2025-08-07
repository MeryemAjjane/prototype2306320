    import React, { useState } from 'react';
    import {
      Typography,
      Box,
      Paper,
      List,
      ListItem,
      ListItemText,
      ListItemIcon,
      Collapse,
      IconButton,
      Chip,
      Tooltip,
      Grid,
      Button
    } from '@mui/material';
    import { styled } from '@mui/material/styles';
    import ExpandLess from '@mui/icons-material/ExpandLess';
    import ExpandMore from '@mui/icons-material/ExpandMore';
    import FolderOpenIcon from '@mui/icons-material/FolderOpen'; // Epic
    import AssignmentIcon from '@mui/icons-material/Assignment'; // Feature
    import ArticleIcon from '@mui/icons-material/Article'; // User Story
    import TaskAltIcon from '@mui/icons-material/TaskAlt'; // Task
    import BugReportIcon from '@mui/icons-material/BugReport'; // Bug
    import PersonIcon from '@mui/icons-material/Person'; // Assigned Agent
    import AccessTimeIcon from '@mui/icons-material/AccessTime'; // Estimated Hours
    import ScheduleIcon from '@mui/icons-material/Schedule'; // Suggested Sprint
    import EditIcon from '@mui/icons-material/Edit'; // Edit Icon
    import DeleteIcon from '@mui/icons-material/Delete'; // Delete Icon
    import AddIcon from '@mui/icons-material/Add'; // Add Icon

    // Import du modal de modification
    import BacklogItemEditModal from './BacklogEditModal';

    // Custom styled Paper for sections, similar to Azure DevOps cards
    const StyledPaper = styled(Paper)(({ theme }) => ({
      padding: theme.spacing(3),
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[3],
      marginBottom: theme.spacing(4),
      backgroundColor: '#ffffff', // White background
    }));

    // Utility functions for colors (keeping them here for self-containment)
    const getPriorityColor = (priority) => {
      switch (priority?.toLowerCase?.()) {
        case 'high':
          return { bgcolor: '#ef4444', color: 'white' }; // Red 500
        case 'medium':
          return { bgcolor: '#eab308', color: 'white' }; // Yellow 500
        case 'low':
          return { bgcolor: '#22c55e', color: 'white' }; // Green 500
        case 'critical': // Added critical priority
          return { bgcolor: '#8b0000', color: 'white' }; // Dark Red
        default:
          return { bgcolor: '#9ca3af', color: 'white' }; // Gray 400
      }
    };

    const getStatusColor = (status) => {
      switch (status?.toLowerCase?.()) {
        case 'todo':
          return { bgcolor: '#6b7280', color: 'white' }; // Gray 600
        case 'in progress':
          return { bgcolor: '#2563eb', color: 'white' }; // Blue 600
        case 'done':
          return { bgcolor: '#10b981', color: 'white' }; // Emerald 500
        case 'verified': // Added verified status
          return { bgcolor: '#059669', color: 'white' }; // Green 600
        case 'blocked':
          return { bgcolor: '#dc2626', color: 'white' }; // Red 600
        default:
          return { bgcolor: '#9ca3af', color: 'white' }; // Gray 400
      }
    };

    // Helper function to build the hierarchical structure
    const buildHierarchy = (items) => {
      const itemMap = new Map(items.map(item => [item.id, { ...item, children: [] }]));
      const rootItems = [];

      itemMap.forEach(item => {
        if (item.parentId && itemMap.has(item.parentId)) {
          itemMap.get(item.parentId).children.push(item);
        } else {
          rootItems.push(item);
        }
      });

      // Sort children by task type (Epic, Feature, User Story, Task, Bug) and then by priority
      const sortChildren = (children) => {
        const order = {
          'epic': 1,
          'feature': 2,
          'user_story': 3,
          'task': 4,
          'bug': 5
        };
        const priorityOrder = {
          'critical': 0, // Added critical
          'high': 1,
          'medium': 2,
          'low': 3
        };

        return children.sort((a, b) => {
          const typeA = order[a.taskType?.toLowerCase?.()] || 99;
          const typeB = order[b.taskType?.toLowerCase?.()] || 99;
          if (typeA !== typeB) return typeA - typeB;

          const priorityA = priorityOrder[a.priority?.toLowerCase?.()] || 99;
          const priorityB = priorityOrder[b.priority?.toLowerCase?.()] || 99;
          return priorityA - priorityB;
        }).map(item => ({ ...item, children: sortChildren(item.children) })); // Recursively sort children
      };

      return sortChildren(rootItems);
    };


    // Recursive component to render each backlog item and its children
    const BacklogItem = ({ item, level = 0, getPriorityColor, getStatusColor, onEdit, onDelete }) => {
      const [open, setOpen] = useState(false);

      const handleClick = () => {
        if (item.children && item.children.length > 0) {
          setOpen(!open);
        }
      };

      const getIconForTaskType = (taskType) => {
        switch (taskType?.toLowerCase?.()) {
          case 'epic':
            return <FolderOpenIcon sx={{ color: '#4f46e5' }} />;
          case 'feature':
            return <AssignmentIcon sx={{ color: '#059669' }} />;
          case 'user_story':
            return <ArticleIcon sx={{ color: '#f59e0b' }} />;
          case 'task':
            return <TaskAltIcon sx={{ color: '#3b82f6' }} />;
          case 'bug':
            return <BugReportIcon sx={{ color: '#ef4444' }} />;
          default:
            return <ArticleIcon sx={{ color: '#9ca3af' }} />;
        }
      };

      return (
        <>
          <ListItem
            sx={{
              pl: level * 4, // Indentation based on level
              borderBottom: '1px solid #e0e0e0',
              '&:hover': { bgcolor: '#f5f5f5' },
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            // onClick={handleClick} // Removed direct click on ListItem to expand/collapse
          >
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }} onClick={handleClick}>
              <ListItemIcon>
                {getIconForTaskType(item.taskType)}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                    <Typography variant="body1" component="span" sx={{ fontWeight: 'medium', mr: 1 }}>
                      {item.title || 'Titre manquant'}
                    </Typography>
                    <Chip
                      label={item.taskType?.replace('_', ' ').toUpperCase() || 'UNKNOWN'}
                      size="small"
                      sx={{ mr: 1, bgcolor: '#e0e7ff', color: '#4f46e5', fontWeight: 'bold' }} // Light indigo chip
                    />
                    <Chip
                      label={(item.priority || 'unknown').toUpperCase()}
                      size="small"
                      sx={{ ...getPriorityColor(item.priority), fontWeight: 'bold' }}
                    />
                  </Box>
                }
                secondary={
                  <Box sx={{ mt: 0.5, color: 'text.secondary', fontSize: '0.875rem' }}>
                    <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                      {item.description || 'Description non disponible'}
                    </Typography>
                    <Grid container spacing={1} sx={{ mt: 1 }}>
                      {item.assignedAgent && (
                        <Grid item>
                          <Chip
                            icon={<PersonIcon sx={{ fontSize: 16 }} />}
                            label={item.assignedAgent}
                            size="small"
                            sx={{ bgcolor: '#f0f9ff', color: '#0c4a6e', fontWeight: 'medium' }} // Light blue chip
                          />
                        </Grid>
                      )}
                      {item.estimatedHours !== undefined && item.estimatedHours !== null && (
                        <Grid item>
                          <Chip
                            icon={<AccessTimeIcon sx={{ fontSize: 16 }} />}
                            label={`${item.estimatedHours}h`}
                            size="small"
                            sx={{ bgcolor: '#ecfdf5', color: '#065f46', fontWeight: 'medium' }} // Light green chip
                          />
                        </Grid>
                      )}
                      {item.status && (
                        <Grid item>
                          <Chip
                            label={item.status.toUpperCase()}
                            size="small"
                            sx={{ ...getStatusColor(item.status), fontWeight: 'bold' }}
                          />
                        </Grid>
                      )}
                      {item.suggestedSprintName && (
                        <Grid item>
                          <Chip
                            icon={<ScheduleIcon sx={{ fontSize: 16 }} />}
                            label={item.suggestedSprintName}
                            size="small"
                            sx={{ bgcolor: '#fef3c7', color: '#92400e', fontWeight: 'medium' }} // Light orange chip
                          />
                        </Grid>
                      )}
                      {item.parentId && (
                        <Grid item>
                          <Tooltip title={`Parent ID: ${item.parentId}`}>
                            <Chip
                              label="Sub-item"
                              size="small"
                              sx={{ bgcolor: '#e0f2fe', color: '#0288d1', fontWeight: 'medium' }} // Light blue
                            />
                          </Tooltip>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                }
              />
            </Box>
            {/* Action Buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              <Tooltip title="Modifier">
                <IconButton edge="end" aria-label="edit" onClick={() => onEdit(item)} size="small">
                  <EditIcon sx={{ color: '#f59e0b' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Supprimer">
                <IconButton edge="end" aria-label="delete" onClick={() => onDelete(item.id)} size="small">
                  <DeleteIcon sx={{ color: '#ef4444' }} />
                </IconButton>
              </Tooltip>
              {item.children && item.children.length > 0 && (
                <IconButton onClick={handleClick} size="small">
                  {open ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              )}
            </Box>
          </ListItem>
          {item.children && item.children.length > 0 && (
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.children.map(child => (
                  <BacklogItem
                    key={child.id}
                    item={child}
                    level={level + 1}
                    getPriorityColor={getPriorityColor}
                    getStatusColor={getStatusColor}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </List>
            </Collapse>
          )}
        </>
      );
    };


    function BacklogDisplay({ backlogData, onNewUploadClick, onUpdateBacklogItem, onDeleteBacklogItem, onCreateBacklogItem,onEditBacklogItem }) {
      // Les états isModalOpen, editingItem, modalError, modalLoading sont maintenant gérés dans App.js
      // et passés via les props si nécessaire pour le modal.

      // Extract unique agent names for the dropdown in the modal
      const agentOptions = Array.from(new Set(
        (backlogData.backlog || [])
          .filter(item => item.assignedAgent && item.assignedAgent !== 'Unassigned')
          .map(item => item.assignedAgent)
      ));
      // Add 'Unassigned' as a default option if it's not already there
      if (!agentOptions.includes('Unassigned')) {
        agentOptions.unshift('Unassigned');
      }

      // Extract unique sprint names for the dropdown in the modal
      const sprintNames = Array.from(new Set(
        (backlogData.backlog || [])
          .filter(item => item.suggestedSprintName && item.suggestedSprintName !== 'Non planifié')
          .map(item => item.suggestedSprintName)
      ));
      // Add 'Non planifié' as a default option if it's not already there
      if (!sprintNames.includes('Non planifié')) {
        sprintNames.unshift('Non planifié');
      }


      
      const handleDeleteClick = async (itemId) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet élément du backlog ?")) {
          try {
            await onDeleteBacklogItem(itemId);
          } catch (error) {
            console.error("Erreur lors de la suppression:", error);
            alert("Erreur lors de la suppression de l'élément.");
          }
        }
      };



      if (!backlogData || !backlogData.backlog || backlogData.backlog.length === 0) {
        return (
          <StyledPaper elevation={3} sx={{ textAlign: 'center', maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'semibold', color: 'text.secondary' }}>
              Aucune donnée de backlog disponible.
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
              Veuillez importer un fichier PDF via le "Générateur PDF" pour afficher le backlog ou
              ajoutez-en un manuellement.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="contained"
                onClick={onNewUploadClick}
                sx={{
                  py: 1.5,
                  px: 3,
                  bgcolor: '#C7D9E5',
                  '&:hover': { bgcolor: '#1d4ed8' },
                  fontSize: '1rem',
                  color:'#2F4157',
                  fontWeight: 'semibold',
                }}
              >
                Upload d'un nouveau Cahier des Charges
              </Button>
              <Button
                variant="contained"
                onClick={onCreateBacklogItem} // Bouton pour ajouter manuellement
                startIcon={<AddIcon />}
                sx={{
                  py: 1.5,
                  px: 3,
                  bgcolor: '#059669', // Green for Add
                  '&:hover': { bgcolor: '#047857' },
                  fontSize: '1rem',
                  color:'white',
                  fontWeight: 'semibold',
                }}
              >
                Ajouter un élément manuel
              </Button>
            </Box>
          </StyledPaper>
        );
      }

      const hierarchicalBacklog = buildHierarchy(backlogData.backlog);

      return (
        <StyledPaper elevation={3}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
              Backlog pour le Projet : <Typography component="span" variant="inherit" sx={{ color: '#4f46e5' }}>{backlogData.project || 'Projet Sans Nom'}</Typography>
            </Typography>
            <Button
              variant="contained"
              onClick={onCreateBacklogItem} // Bouton pour ajouter manuellement
              startIcon={<AddIcon />}
              sx={{
                bgcolor: '#059669', // Green for Add
                '&:hover': { bgcolor: '#047857' },
                color:'white',
                fontWeight: 'semibold',
              }}
            >
              Ajouter un élément
            </Button>
          </Box>

          <Typography variant="h6" component="h3" sx={{ fontWeight: 'semibold', mb: 2, mt: 3, color: 'text.secondary' }}>
            Éléments du Backlog ({backlogData.backlog.length}) :
          </Typography>

          <List
            sx={{
              width: '100%',
              bgcolor: 'background.paper',
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            {hierarchicalBacklog.map(item => (
              <BacklogItem
                key={item.id}
                item={item}
                getPriorityColor={getPriorityColor}
                getStatusColor={getStatusColor}
                onEdit={onEditBacklogItem} // onEdit appellera handleOpenCreateModal qui settera editingItem
                onDelete={handleDeleteClick}
              />
            ))}
          </List>

          {/* Display Assignments and Execution Plan */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 'semibold', mb: 2, color: 'text.secondary' }}>
              Assignations des Agents :
            </Typography>
            {backlogData.assignments && Object.keys(backlogData.assignments).length > 0 ? (
              <Grid container spacing={2}>
                {Object.entries(backlogData.assignments).map(([agentName, tasks]) => (
                  <Grid item xs={12} md={6} key={agentName}>
                    <StyledPaper elevation={2} sx={{ p: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#2F4157' }}>
                        {agentName} ({Array.isArray(tasks) ? tasks.length : 0} tâches)
                      </Typography>
                      <List dense>
                        {Array.isArray(tasks) && tasks.length > 0 ? (
                          tasks.map(task => (
                            <ListItem key={task.id || Math.random()} disablePadding sx={{ py: 0.5 }}>
                              <ListItemText
                                primary={
                                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                                    <Typography variant="body2" sx={{ fontWeight: 'medium', mr: 1 }}>
                                      {task.title || 'Titre manquant'}
                                    </Typography>
                                    <Chip
                                     label={task.taskType?.replace('_', ' ').toUpperCase() || 'UNKNOWN'}
                                      size="small"
                                      sx={{ mr: 0.5, bgcolor: '#e0e7ff', color: '#4f46e5' }}
                                    />
                                    <Chip
                                      label={(task.priority || 'unknown').toUpperCase()}
                                      size="small"
                                      sx={{ ...getPriorityColor(task.priority) }}
                                    />
                                  </Box>
                                }
                                secondary={
                                  <Typography variant="caption" color="text.secondary">
                                    {task.description && typeof task.description === 'string'
                                      ? `${task.description.substring(0, 70)}...`
                                      : 'Description non disponible'}
                                    {task.suggestedSprintName && ` | Sprint: ${task.suggestedSprintName}`}
                                  </Typography>
                                }
                              />
                            </ListItem>
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            Aucune tâche assignée.
                          </Typography>
                        )}
                      </List>
                    </StyledPaper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1" color="text.secondary">
                Aucune assignation d'agent disponible.
              </Typography>
            )}
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 'semibold', mb: 2, color: 'text.secondary' }}>
              Plan d'Exécution et Artefacts :
            </Typography>
            {backlogData.execution_plan && Object.keys(backlogData.execution_plan).length > 0 ? (
              <Grid container spacing={2}>
                {Object.entries(backlogData.execution_plan).map(([agentName, plan]) => (
                  <Grid item xs={12} md={6} key={agentName}>
                    <StyledPaper elevation={2} sx={{ p: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#2F4157' }}>
                        {agentName} (Total Heures: {plan.total_hours || 0}h)
                      </Typography>
                      <Typography variant="subtitle2" sx={{ mt: 1, mb: 1, color: 'text.secondary' }}>
                        Tâches Exécutables:
                      </Typography>
                      <List dense>
                          {plan.tasks && Array.isArray(plan.tasks) && plan.tasks.length > 0 ? (
                            plan.tasks.map((task, index) => (
                              <ListItem key={task.id || index} disablePadding sx={{ py: 0.5 }}>
                                <ListItemText
                                  primary={
                                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                      {task.title || 'Titre manquant'} ({task.estimatedHours || 0}h)
                                    </Typography>
                                  }
                                  secondary={
                                    <Typography variant="caption" color="text.secondary">
                                      {task.description && typeof task.description === 'string'
                                        ? `${task.description.substring(0, 70)}...`
                                        : 'Description non disponible'}
                                    </Typography>
                                  }
                                />
                              </ListItem>
                            ))
                          ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                              Aucune tâche exécutable assignée.
                            </Typography>
                          )}
                        </List>

                      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, color: 'text.secondary' }}>
                        Artefacts Générés:
                      </Typography>
                     <List dense>
                          {plan.artifacts && Array.isArray(plan.artifacts) && plan.artifacts.length > 0 ? (
                            plan.artifacts.map((artifact, index) => (
                              <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                                <ListItemText
                                  primary={
                                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                      {artifact.description || 'Description manquante'} (Type: {artifact.type || 'Non défini'})
                                    </Typography>
                                  }
                                  secondary={
                                    <Typography variant="caption" color="text.secondary">
                                      Fichiers: {(Array.isArray(artifact.files) ? artifact.files.join(', ') : 'Aucun fichier')}
                                    </Typography>
                                  }
                                />
                              </ListItem>
                            ))
                          ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                              Aucun artefact généré.
                            </Typography>
                          )}
                        </List>

                    </StyledPaper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1" color="text.secondary">
                Aucun plan d'exécution disponible.
              </Typography>
              )}
          </Box>

      
        </StyledPaper>
      );
    }

    export default BacklogDisplay;
    