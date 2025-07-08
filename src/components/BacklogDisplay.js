import React from 'react';
import {
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemText,
  Button,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  marginBottom: theme.spacing(4),
}));

function BacklogDisplay({ backlogData, onNewUploadClick, getPriorityColor, getStatusColor }) {
  return (
    <>
      {backlogData ? (
        <StyledPaper elevation={3}>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 3, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
            Backlog pour le Projet : <Typography component="span" variant="inherit" sx={{ color: '#4f46e5' }}>{backlogData.project}</Typography>
          </Typography>

          <Typography variant="h6" component="h3" sx={{ fontWeight: 'semibold', mb: 2, mt: 3, color: 'text.secondary' }}>
            Éléments du Backlog ({backlogData.backlog.length}) :
          </Typography>
          <TableContainer component={Paper} sx={{ mb: 4, border: '1px solid #e0e0e0' }}>
            <Table sx={{ minWidth: 650 }} aria-label="backlog table">
              <TableHead sx={{ bgcolor: '#f9fafb' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'medium', fontSize: '0.75rem', textTransform: 'uppercase', color: 'text.secondary' }}>Titre</TableCell>
                  <TableCell sx={{ fontWeight: 'medium', fontSize: '0.75rem', textTransform: 'uppercase', color: 'text.secondary' }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 'medium', fontSize: '0.75rem', textTransform: 'uppercase', color: 'text.secondary' }}>Priorité</TableCell>
                  <TableCell sx={{ fontWeight: 'medium', fontSize: '0.75rem', textTransform: 'uppercase', color: 'text.secondary' }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 'medium', fontSize: '0.75rem', textTransform: 'uppercase', color: 'text.secondary' }}>Estimé (h)</TableCell>
                  <TableCell sx={{ fontWeight: 'medium', fontSize: '0.75rem', textTransform: 'uppercase', color: 'text.secondary' }}>Assigné à</TableCell>
                  <TableCell sx={{ fontWeight: 'medium', fontSize: '0.75rem', textTransform: 'uppercase', color: 'text.secondary' }}>Statut</TableCell>
                  <TableCell sx={{ fontWeight: 'medium', fontSize: '0.75rem', textTransform: 'uppercase', color: 'text.secondary' }}>Suggéré par</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {backlogData.backlog.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ color: 'text.secondary' }}>
                      Aucun élément de backlog trouvé.
                    </TableCell>
                  </TableRow>
                ) : (
                  backlogData.backlog.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell component="th" scope="row" sx={{ fontWeight: 'medium', color: 'text.primary', width: '16.66%' }}>
                        {item.title}
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary', width: '33.33%' }}>{item.description}</TableCell>
                      <TableCell>
                        <Box
                          component="span"
                          sx={{
                            ...getPriorityColor(item.priority),
                            px: 1, py: 0.5, borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'semibold', display: 'inline-flex'
                          }}
                        >
                          {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>
                        {item.task_type.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{item.estimatedHours}h</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{item.assigned_agent || 'Non Assigné'}</TableCell>
                      <TableCell>
                        <Box
                          component="span"
                          sx={{
                            ...getStatusColor(item.status),
                            px: 1, py: 0.5, borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'semibold', display: 'inline-flex'
                          }}
                        >
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{item.suggested_by}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Section Assignations des Agents */}
          <Typography variant="h6" component="h3" sx={{ fontWeight: 'semibold', mb: 2, mt: 4, pb: 1, borderBottom: '1px solid #e0e0e0', color: 'text.secondary' }}>
            Assignations des Agents :
          </Typography>
          {backlogData.assignments && Object.keys(backlogData.assignments).length > 0 ? (
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {Object.entries(backlogData.assignments).map(([agentName, tasks]) => (
                <Grid item xs={12} md={6} key={agentName}>
                  <Paper elevation={1} sx={{ p: 3, bgcolor: '#f0f4f8', border: '1px solid #e0e0e0' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1.5, color: 'text.primary' }}>{agentName}</Typography>
                    {tasks.length > 0 ? (
                      <List dense sx={{ listStyleType: 'disc', pl: 2 }}>
                        {tasks.map(task => (
                          <ListItem key={task.id} sx={{ display: 'list-item', pl: 0 }}>
                            <ListItemText primary={`${task.title} (Type: ${task.task_type.replace(/_/g, ' ').toLowerCase()}, Est: ${task.estimatedHours}h)`}
                              primaryTypographyProps={{ fontSize: '0.875rem', color: 'text.secondary' }} />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>Aucune tâche assignée.</Typography>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>Aucune assignation d'agent trouvée.</Typography>
          )}

          {/* Section Plan d'Exécution et Artefacts */}
          <Typography variant="h6" component="h3" sx={{ fontWeight: 'semibold', mb: 2, mt: 4, pb: 1, borderBottom: '1px solid #e0e0e0', color: 'text.secondary' }}>
            Plan d'Exécution et Artefacts :
          </Typography>
          {backlogData.execution_plan && Object.keys(backlogData.execution_plan).length > 0 ? (
            <Grid container spacing={3}> {/* Changed Stack to Grid for consistent spacing */}
              {Object.entries(backlogData.execution_plan).map(([agentName, plan]) => (
                <Grid item xs={12} key={agentName}> {/* Each plan item takes full width for consistency with previous Stack behavior */}
                  <Paper elevation={1} sx={{ p: 3, bgcolor: '#e3f2fd', borderLeft: '4px solid #2196f3' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }}>{agentName}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>Total Heures : <Typography component="span" variant="body2" sx={{ fontWeight: 'semibold' }}>{plan.total_hours}h</Typography></Typography>
                    {plan.artifacts && plan.artifacts.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'semibold', mb: 1, color: 'text.secondary' }}>Artefacts Générés :</Typography>
                        <List dense sx={{ listStyleType: 'disc', pl: 2 }}>
                          {plan.artifacts.map((artifact, idx) => (
                            <ListItem key={idx} sx={{ display: 'list-item', pl: 0 }}>
                              <ListItemText
                                primary={
                                  <>
                                    <Typography component="span" variant="body2" sx={{ fontWeight: 'medium' }}>Type:</Typography> {artifact.type.charAt(0).toUpperCase() + artifact.type.slice(1)},
                                    <Typography component="span" variant="body2" sx={{ fontWeight: 'medium', ml: 1 }}>Description:</Typography> {artifact.description},
                                    <Typography component="span" variant="body2" sx={{ fontWeight: 'medium', ml: 1 }}>Fichiers:</Typography> {artifact.files.join(', ')}
                                  </>
                                }
                                primaryTypographyProps={{ fontSize: '0.875rem', color: 'text.secondary' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                    {(!plan.artifacts || plan.artifacts.length === 0) && (
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>Aucun artefact généré pour cet agent.</Typography>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Aucun plan d'exécution trouvé.</Typography>
          )}

          <Button
            variant="outlined"
            startIcon={<UploadFileIcon />}
            onClick={onNewUploadClick}
            sx={{
              mt: 5,
              py: 1.5,
              px: 3,
              bgcolor: '#2563eb', // Blue 600
              color: 'white',
              borderColor: '#2563eb',
              '&:hover': {
                bgcolor: '#1d4ed8', // Blue 700
                borderColor: '#1d4ed8'
              },
              fontSize: '1rem',
              fontWeight: 'semibold',
              mx: 'auto',
              display: 'flex'
            }}
          >
            Upload d'un nouveau Cahier des Charges
          </Button>
        </StyledPaper>
      ) : (
        <StyledPaper elevation={3} sx={{ textAlign: 'center', maxWidth: 600, mx: 'auto', mt: 4 }}>
          <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'semibold', color: 'text.secondary' }}>
            Aucune donnée de backlog disponible.
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
            Veuillez importer un fichier PDF via le "Générateur PDF" pour afficher le backlog.
          </Typography>
          <Button
            variant="contained"
            onClick={onNewUploadClick} // Using onNewUploadClick to go to generator
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
            Aller au Générateur
          </Button>
        </StyledPaper>
      )}
    </>
  );
}

export default BacklogDisplay;
