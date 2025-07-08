import { AppBar, Toolbar, Typography, Box, Stack, IconButton } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Header({ projectName }) {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: 'white',
        boxShadow: 3,
        color: 'text.primary',
      }}
    >
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center'}}>
          <img src="https://placehold.co/32x32/2F4157/ffffff?text=AD" alt="Gestion Logo" style={{ height: 32, width: 32, marginRight: 12, borderRadius: 4 }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            AutoBacklog Generator
          </Typography>
          <Typography variant="h6" component="div" sx={{ color: 'text.secondary', mx: 2 }}>
            /
          </Typography>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'semibold' }}>
            {projectName}
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Stack direction="row" spacing={2}>
          <IconButton color="inherit" aria-label="notifications">
            <NotificationsIcon />
          </IconButton>
          <IconButton color="inherit" aria-label="account">
            <AccountCircleIcon />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
