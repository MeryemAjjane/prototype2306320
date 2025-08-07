
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Select, MenuItem, FormControl, InputLabel,
  Box, Typography, CircularProgress
} from '@mui/material';

function BacklogEditModal({ open, onClose, item, onSave, isLoading, error, sprintNames, agentOptions,parentOptions }) {
  // Initialiser l'état du formulaire avec les données de l'élément existant ou des valeurs par défaut
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    taskType: 'user_story',
    estimatedHours: 0,
    assignedAgent: 'Unassigned',
    suggestedSprintName: '',
    parentId: '' // Pour la modification du parent
  });

  // Mettre à jour le formulaire si l'élément à modifier change
  useEffect(() => {
    if (item) {
      setFormData({
        id: item.id || '',
        title: item.title || '',
        description: item.description || '',
        priority: item.priority || 'medium',
        status: item.status || 'todo',
        taskType: item.taskType || 'user_story',
        estimatedHours: item.estimatedHours || 0,
        assignedAgent: item.assignedAgent || 'Unassigned',
        suggestedSprintName: item.suggestedSprintName || '',
        parentId: item.parentId || ''
      });
    } else {
      // Réinitialiser le formulaire pour un ajout (bien que ce modal soit principalement pour l'édition)
      setFormData({
        id: '',
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        taskType: 'user_story',
        estimatedHours: 0,
        assignedAgent: 'Unassigned',
        suggestedSprintName: '',
        parentId: ''
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'estimatedHours' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const priorityOptions = ['low', 'medium', 'high', 'critical'];
  const statusOptions = ['todo', 'in progress', 'done', 'verified', 'blocked'];
  const taskTypeOptions = ['epic', 'feature', 'user_story', 'task', 'bug'];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ bgcolor: '#4f46e5', color: 'white', py: 2 }}>
        <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
          {item ? 'Modifier l\'Élément du Backlog' : 'Ajouter un Nouvel Élément'}
        </Typography>
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 2 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Titre"
            name="title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            variant="outlined"
          />

          <FormControl fullWidth variant="outlined">
            <InputLabel>Priorité</InputLabel>
            <Select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              label="Priorité"
            >
              {priorityOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth variant="outlined">
            <InputLabel>Statut</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              label="Statut"
            >
              {statusOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth variant="outlined">
            <InputLabel>Type de tâche</InputLabel>
            <Select
              name="taskType"
              value={formData.taskType}
              onChange={handleChange}
              label="Type de tâche"
            >
              {taskTypeOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Heures estimées"
            name="estimatedHours"
            type="number"
            value={formData.estimatedHours}
            onChange={handleChange}
            fullWidth
            variant="outlined"
            inputProps={{ min: 0 }}
          />

          <FormControl fullWidth variant="outlined">
            <InputLabel>Agent assigné (IA)</InputLabel>
            <Select
              name="assignedAgent"
              value={formData.assignedAgent}
              onChange={handleChange}
              label="Agent assigné (IA)"
            >
              <MenuItem value="Unassigned">Non assigné</MenuItem>
              {agentOptions.map((agent) => (
                <MenuItem key={agent} value={agent}>{agent}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth variant="outlined">
            <InputLabel>Sprint suggéré</InputLabel>
            <Select
              name="suggestedSprintName"
              value={formData.suggestedSprintName}
              onChange={handleChange}
              label="Sprint suggéré"
            >
              <MenuItem value="">Non planifié</MenuItem>
              {sprintNames.map((sprint) => (
                <MenuItem key={sprint} value={sprint}>{sprint}</MenuItem>
              ))}
            </Select>
          </FormControl>

            {/* Nouveau champ pour le Parent ID comme dropdown */}
          <FormControl fullWidth variant="outlined">
            <InputLabel>Parent (ID)</InputLabel>
            <Select
              name="parentId"
              value={formData.parentId}
              onChange={handleChange}
              label="Parent (ID)"
            >
              <MenuItem value="">
                <em>Aucun parent</em>
              </MenuItem>
              {parentOptions.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.title} (ID: {option.id})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button onClick={onClose} color="secondary" variant="outlined" disabled={isLoading}>
          Annuler
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained" disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sauvegarder'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default BacklogEditModal;
