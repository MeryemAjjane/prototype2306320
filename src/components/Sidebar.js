import React from 'react';
// Les composants Material-UI pour construire le menu 
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography
} from '@mui/material';

// Import des icônes utilisées dans le menu
import UploadFileIcon from '@mui/icons-material/UploadFile';
import StorageIcon from '@mui/icons-material/Storage';

// Définition des entrées du menu dans un tableau
const menuItems = [
  { key: 'generator', label: 'Générateur PDF', icon: <UploadFileIcon /> },
  { key: 'backlog', label: 'Backlog du Projet', icon: <StorageIcon /> },
  { key: 'projects', label: 'Liste de Projet', icon: <StorageIcon /> },
  { key: 'collapse', label: 'Liste', icon: <StorageIcon /> },
];


// Composant Sidebar
// activeView (string) : la vue actuellement active
// setActiveView (function) : fonction pour changer la vue active
// drawerWidth (number) : largeur en pixels du Drawer
function Sidebar({ activeView, setActiveView, drawerWidth }) {
  return (
    <Drawer
      variant="permanent" // toujours visible
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: '#2F4157',
          color: 'white'
        }
      }}
    >
      <Toolbar /> {/* Ajoute un espace en haut pour ne pas être caché par la barre AppBar*/}      
      <Box sx={{ overflow: 'auto', p: 2 }}>
        {/* Titre de la section du menu */}
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 'semibold', mb: 2, color: '#e0e0e0' }}
        >
          Boards
        </Typography>

        <List>
          {menuItems.map((item) => (
            <ListItem key={item.key} disablePadding>
              {/* Bouton pour changer la vue */}
              <ListItemButton
                onClick={() => setActiveView(item.key)}
                sx={{
                  borderRadius: 1,
                  // Si c'est la vue active, on met un fond bleu, sinon transparent
                  bgcolor: activeView === item.key ? '#4f46e5' : 'transparent',
                  '&:hover': {
                    bgcolor: activeView === item.key ? '#4f46e5' : '#4a5568',
                  },
                }}
              >
                {/* Icône du bouton */}
                <ListItemIcon
                  sx={{ color: activeView === item.key ? 'white' : '#cbd5e0' }}
                >
                  {item.icon}
                </ListItemIcon>

                {/* Texte du bouton */}
                <ListItemText
                  primary={item.label}
                  sx={{ color: activeView === item.key ? 'white' : '#C7D9E5' }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

export default Sidebar;
