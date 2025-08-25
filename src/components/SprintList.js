import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Tooltip,
  Menu,
  MenuItem
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  marginBottom: theme.spacing(2),
  height: '100%'
}));

const KanbanColumn = styled(Box)(({ theme }) => ({
  backgroundColor: '#f8fafc',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  minHeight: '500px',
  border: '2px dashed transparent',
  transition: 'all 0.2s ease',
  '&.drag-over': {
    borderColor: theme.palette.primary.main,
    backgroundColor: '#e3f2fd',
  }
}));

const SprintCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
  cursor: 'grab',
  transition: 'all 0.2s ease',
  border: '1px solid #e0e7ff',
  '&:hover': {
    boxShadow: theme.shadows[4],
    transform: 'translateY(-2px)',
  },
  '&.dragging': {
    opacity: 0.6,
    cursor: 'grabbing',
    transform: 'rotate(5deg)',
  }
}));

const ColumnHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1, 0),
  borderBottom: `2px solid ${theme.palette.divider}`
}));

const StatusIcon = ({ status }) => {
  const iconProps = { sx: { fontSize: 18 } };
  
  switch (status?.toLowerCase()) {
    case 'to do':
    case 'planned':
      return <AccessTimeIcon {...iconProps} sx={{ color: '#ff9800' }} />;
    case 'doing':
    case 'active':
    case 'in progress':
      return <PlayArrowIcon {...iconProps} sx={{ color: '#2196f3' }} />;
    case 'done':
    case 'completed':
      return <CheckCircleIcon {...iconProps} sx={{ color: '#4caf50' }} />;
    default:
      return <AccessTimeIcon {...iconProps} sx={{ color: '#9e9e9e' }} />;
  }
};
// C'est le NOUVEAU composant SprintForm.
// Placez-le ici, avant la fonction principale SprintList.
const SprintForm = ({
  isFormOpen,
  handleCloseForm,
  sprintToEdit,
  formData,
  handleFormChange,
  createSprint,
  updateSprint,
}) => (
  <Dialog
    open={isFormOpen}
    onClose={handleCloseForm}
    fullWidth
    maxWidth="sm"
    disableEscapeKeyDown={false}
  >
    <DialogTitle>{sprintToEdit ? 'Modifier le Sprint' : 'Nouveau Sprint'}</DialogTitle>
    <DialogContent>
      <TextField
        margin="dense"
        name="name"
        label="Nom du Sprint"
        type="text"
        fullWidth
        value={formData.name || ''}
        onChange={(e) => handleFormChange('name', e.target.value)}
      />
      <TextField
        margin="dense"
        name="goal"
        label="Objectif"
        type="text"
        fullWidth
        multiline
        rows={2}
        value={formData.goal || ''}
        onChange={(e) => handleFormChange('goal', e.target.value)}
        sx={{ mt: 2 }}
      />
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
          <DatePicker
            label="Date de Début"
            value={formData.startDate}
            onChange={(newValue) => handleFormChange('startDate', newValue)}
            slotProps={{ textField: { fullWidth: true } }}
          />
          <DatePicker
            label="Date de Fin"
            value={formData.endDate}
            onChange={(newValue) => handleFormChange('endDate', newValue)}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </LocalizationProvider>
      </Box>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCloseForm} color="error">
        Annuler
      </Button>
      <Button
        onClick={() => (sprintToEdit ? updateSprint(sprintToEdit.id, formData) : createSprint(formData))}
        variant="contained"
        sx={{ bgcolor: '#4338ca', '&:hover': { bgcolor: '#3730a3' } }}
      >
        {sprintToEdit ? 'Mettre à jour' : 'Créer'}
      </Button>
    </DialogActions>
  </Dialog>
);
function SprintList({ projectId, projectName, onSprintClick, onBackClick }) {
  const [sprints, setSprints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draggedSprint, setDraggedSprint] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [sprintToEdit, setSprintToEdit] = useState(null);
  const [formData, setFormData] = useState({ name: '', startDate: null, endDate: null, goal: '' });
  
  // État pour le menu contextuel
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSprint, setSelectedSprint] = useState(null);

  const columns = [
    { 
      id: 'todo', 
      title: 'To Do', 
      status: ['TO DO', 'PLANNED'], 
      color: '#ff9800',
      bgColor: '#fff3e0'
    },
    { 
      id: 'doing', 
      title: 'Doing', 
      status: ['DOING', 'ACTIVE', 'IN PROGRESS'], 
      color: '#2196f3',
      bgColor: '#e3f2fd'
    },
    { 
      id: 'done', 
      title: 'Done', 
      status: ['DONE', 'COMPLETED'], 
      color: '#4caf50',
      bgColor: '#e8f5e8'
    }
  ];

  // Réinitialise le formulaire quand il est fermé
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSprintToEdit(null);
    setFormData({ name: '', startDate: null, endDate: null, goal: '' });
  };
  
  // Ouvre le formulaire pour créer un nouveau sprint
  const handleOpenForm = () => {
    setSprintToEdit(null);
    setFormData({ name: '', startDate: null, endDate: null, goal: '' });
    setIsFormOpen(true);
  };

  // Ouvre le formulaire pour modifier un sprint existant
  const handleEditSprint = (sprint) => {
    setSprintToEdit(sprint);
    setFormData({
      ...sprint,
      startDate: sprint.startDate ? dayjs(sprint.startDate) : null,
      endDate: sprint.endDate ? dayjs(sprint.endDate) : null
    });
    setIsFormOpen(true);
    // Fermer le menu
    setAnchorEl(null);
    setSelectedSprint(null);
  };

  // Gestion du menu contextuel
  const handleMenuClick = (event, sprint) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    setSelectedSprint(sprint);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSprint(null);
  };

  useEffect(() => {
    fetchSprints();
  }, [projectId]);

  const fetchSprints = async () => {
    if (!projectId) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`http://localhost:8080/api/projects/${projectId}/sprints`);
      setSprints(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des sprints:', err);
      setError('Impossible de charger les sprints du projet.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSprintStatus = async (sprintId, newStatus) => {
    try {
      await axios.put(`http://localhost:8080/api/sprints/${sprintId}`, {
        status: newStatus
      });
      
      // Mettre à jour l'état local
      setSprints(prev => prev.map(sprint => 
        sprint.id === sprintId ? { ...sprint, status: newStatus } : sprint
      ));
    } catch (err) {
      console.error('Erreur lors de la mise à jour du sprint:', err);
      setError('Impossible de mettre à jour le statut du sprint.');
    }
  };
  
  const getSprintsByColumn = (columnStatuses) => {
    return sprints.filter(sprint => 
      columnStatuses.some(status => 
        sprint.status?.toUpperCase() === status.toUpperCase()
      )
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Non défini';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDurationInDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 'N/A';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays}j`;
  };

  // Drag & Drop handlers
  const handleDragStart = (e, sprint) => {
    setDraggedSprint(sprint);
    e.dataTransfer.effectAllowed = 'move';
    e.target.classList.add('dragging');
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('dragging');
    setDraggedSprint(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.target.closest('.kanban-column')?.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      e.target.closest('.kanban-column')?.classList.remove('drag-over');
    }
  };

  const handleDrop = (e, targetColumn) => {
    e.preventDefault();
    e.target.closest('.kanban-column')?.classList.remove('drag-over');
    
    if (draggedSprint) {
      const newStatus = targetColumn.status[0]; // Premier statut de la colonne
      if (draggedSprint.status !== newStatus) {
        updateSprintStatus(draggedSprint.id, newStatus);
      }
    }
  };

  const createSprint = async (newSprintData) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/sprints/projects/${projectId}/createSprint`, 
        { 
          ...newSprintData,
          projectId: projectId,
          startDate: newSprintData.startDate?.format('YYYY-MM-DD'),
          endDate: newSprintData.endDate?.format('YYYY-MM-DD')
        }
      );
      console.log('Sprint créé avec succès:', response.data);
      handleCloseForm();
      fetchSprints();
    } catch (err) {
      console.error('Erreur lors de la création du sprint:', err);
      setError('Impossible de créer le sprint.');
    }
  };

  const updateSprint = async (sprintId, updatedData) => {
    try {
      await axios.put(`http://localhost:8080/api/sprints/${sprintId}`, {
        ...updatedData,
        startDate: updatedData.startDate?.format('YYYY-MM-DD'),
        endDate: updatedData.endDate?.format('YYYY-MM-DD')
      });
      console.log('Sprint mis à jour avec succès.');
      handleCloseForm();
      fetchSprints();
    } catch (err) {
      console.error('Erreur lors de la mise à jour du sprint:', err);
      setError('Impossible de mettre à jour le sprint.');
    }
  };
  const deleteSprint = async (sprintId) => {
  if (!sprintId) {
    console.error("Erreur: ID de sprint manquant pour la suppression.");
    setError("Erreur lors de la suppression du sprint.");
    handleMenuClose();
    return;
  }
  
  // Demande de confirmation à l'utilisateur
  if (window.confirm("Êtes-vous sûr de vouloir supprimer ce sprint ? Cette action est irréversible.")) {
    try {
      await axios.delete(`http://localhost:8080/api/sprints/deleteSprint/${sprintId}`);
      console.log(`Sprint avec l'ID ${sprintId} a été supprimé avec succès.`);
      // Recharger la liste des sprints pour mettre à jour l'UI
      fetchSprints();
    } catch (err) {
      console.error('Erreur lors de la suppression du sprint:', err);
      setError('Impossible de supprimer le sprint. Veuillez réessayer.');
    } finally {
      // Fermer le menu après l'action
      handleMenuClose();
    }
  }
};

  // Gestion des changements dans le formulaire
  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };


  const SprintCardComponent = ({ sprint }) => (
    <SprintCard
      draggable
      onDragStart={(e) => handleDragStart(e, sprint)}
      onDragEnd={handleDragEnd}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, flex: 1 }}>
            {sprint.name}
          </Typography>
          <IconButton 
            size="small" 
            sx={{ ml: 1 }}
            onClick={(e) => handleMenuClick(e, sprint)}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <StatusIcon status={sprint.status} />
          <Chip 
            label={sprint.status || 'Non défini'}
            size="small"
            sx={{ 
              ml: 1, 
              fontSize: '0.7rem',
              height: '20px',
              backgroundColor: columns.find(col => 
                col.status.includes(sprint.status?.toUpperCase())
              )?.bgColor || '#f5f5f5'
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarTodayIcon sx={{ fontSize: 12, mr: 0.5, color: 'text.disabled' }} />
            <Typography variant="caption" color="text.secondary">
              {formatDate(sprint.startDate)}
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ 
            backgroundColor: '#e8f4fd', 
            px: 1, 
            borderRadius: 1,
            color: '#1976d2',
            fontWeight: 500
          }}>
            {getDurationInDays(sprint.startDate, sprint.endDate)}
          </Typography>
        </Box>

        <Typography variant="caption" color="text.secondary">
          Fin: {formatDate(sprint.endDate)}
        </Typography>

        {sprint.description && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mt: 1, 
              fontSize: '0.75rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {sprint.description}
          </Typography>
        )}
      </CardContent>
    </SprintCard>
  );

  if (isLoading) {
    return (
      <StyledPaper elevation={3}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2, color: 'text.secondary' }}>
            Chargement des sprints...
          </Typography>
        </Box>
      </StyledPaper>
    );
  }

  return (
    <StyledPaper elevation={3}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBackClick}
            sx={{ mr: 2, color: '#666' }}
          >
            Retour
          </Button>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Sprints - {projectName}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleOpenForm}
          sx={{ bgcolor: '#4338ca', '&:hover': { bgcolor: '#3730a3' } }}
        >
          Nouveau Sprint
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Kanban Board */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, minHeight: '500px' }}>
        {columns.map((column) => {
          const columnSprints = getSprintsByColumn(column.status);
          
          return (
            <KanbanColumn
              key={column.id}
              className="kanban-column"
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column)}
            >
              <ColumnHeader>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ 
                    bgcolor: column.color, 
                    width: 24, 
                    height: 24, 
                    mr: 1,
                    fontSize: '0.75rem'
                  }}>
                    {columnSprints.length}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: column.color }}>
                    {column.title}
                  </Typography>
                </Box>
              </ColumnHeader>

              <Box sx={{ minHeight: '400px' }}>
                {columnSprints.length === 0 ? (
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 4, 
                    color: 'text.disabled',
                    border: '2px dashed #e0e0e0',
                    borderRadius: 1,
                    backgroundColor: 'rgba(0,0,0,0.02)'
                  }}>
                    <Typography variant="body2">
                      Aucun sprint en {column.title.toLowerCase()}
                    </Typography>
                  </Box>
                ) : (
                  columnSprints.map((sprint) => (
                    <SprintCardComponent key={sprint.id} sprint={sprint} />
                  ))
                )}
              </Box>
            </KanbanColumn>
          );
        })}
      </Box>

      {sprints.length === 0 && !isLoading && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
            Aucun sprint trouvé pour ce projet.
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.disabled' }}>
            Les sprints seront créés automatiquement lors de la génération du backlog.
          </Typography>
        </Box>
      )}

      {/* Menu contextuel pour les actions sur les sprints */}
    <Menu
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      PaperProps={{
        sx: { minWidth: 150 }
      }}
    >
      <MenuItem onClick={() => handleEditSprint(selectedSprint)}>
        <EditIcon fontSize="small" sx={{ mr: 1 }} />
        Modifier
      </MenuItem>
      <MenuItem onClick={() => deleteSprint(selectedSprint?.id)}>
        <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
        Supprimer
     </MenuItem>
    </Menu>

      <SprintForm
      isFormOpen={isFormOpen}
      handleCloseForm={handleCloseForm}
      sprintToEdit={sprintToEdit}
      formData={formData}
      handleFormChange={handleFormChange}
      createSprint={createSprint}
      updateSprint={updateSprint}
    />
    </StyledPaper>
  );
}

export default SprintList;