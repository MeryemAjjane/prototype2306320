import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Box, Typography } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import StorageIcon from '@mui/icons-material/Storage';

function Sidebar({ activeView, setActiveView, drawerWidth }) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', bgcolor: '#2F4157', color: 'white' },
      }}
    >
      <Toolbar /> {/* Spacer for AppBar */}
      <Box sx={{ overflow: 'auto', p: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'semibold', mb: 2, color: '#e0e0e0' }}>
          Boards
        </Typography>
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => setActiveView('generator')}
              sx={{
                borderRadius: 1,
                bgcolor: activeView === 'generator' ? '#C7D9E5' : 'transparent',
                '&:hover': { bgcolor: activeView === 'generator' ? '#C7D9E5' : '#C7D9E5' },
              }}
            >
              <ListItemIcon sx={{ color: activeView === 'generator' ? 'white' : '#C7D9E5' }}>
                <UploadFileIcon />
              </ListItemIcon>
              <ListItemText primary="Générateur PDF" sx={{ color: activeView === 'generator' ? 'white' : '#C7D9E5' }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => setActiveView('backlog')}
              sx={{
                borderRadius: 1,
                bgcolor: activeView === 'backlog' ? '#4f46e5' : 'transparent',
                '&:hover': { bgcolor: activeView === 'backlog' ? '#4f46e5' : '#4a5568' },
              }}
            >
              <ListItemIcon sx={{ color: activeView === 'backlog' ? 'white' : '#cbd5e0' }}>
                <StorageIcon />
              </ListItemIcon>
              <ListItemText primary="Backlog du Projet" sx={{ color: activeView === 'backlog' ? 'white' : '#C7D9E5' }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => setActiveView('projects')}
              sx={{
                borderRadius: 1,
                bgcolor: activeView === 'projects' ? '#4f46e5' : 'transparent',
                '&:hover': { bgcolor: activeView === 'projects' ? '#4f46e5' : '#4a5568' },
              }}
            >
              <ListItemIcon sx={{ color: activeView === 'projects' ? 'white' : '#cbd5e0' }}>
                <StorageIcon />
              </ListItemIcon>
              <ListItemText primary="List de Projet" sx={{ color: activeView === 'projects' ? 'white' : '#C7D9E5' }} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
}

export default Sidebar;
