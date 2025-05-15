import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import { Typography } from '@mui/material';
import { Dashboard, QrCode, Settings } from '@mui/icons-material';
import BookiesLogo from "../assets/bookies_logo.png"
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const city = useSelector((state: RootState) => state.auth.city)

  const items = [
    { title: 'Dashboard', icon: <Dashboard />, path: '/', disabled: true },
    { title: 'Mass Mail', icon: <MailIcon />, path: '/mail', disabled: false },
    { title: 'QR Generator', icon: <QrCode />, path: '/qr', disabled: true },
    { title: 'Config', icon: <Settings />, path: '/config', disabled: true }
  ];

  return (
    <Drawer variant="permanent" anchor="left">
      <Box sx={{ width: '16vw', height: '100%', background: '#FFE6D5' }}>
        <Box sx={{ p: 2, fontWeight: 'bold', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <img src={BookiesLogo} style={{ blockSize: 50 }} />
          <Typography color='primary' sx={{ fontSize: 18, fontWeight: 'bold' }}>{city} Bookies</Typography>
          <Typography color='primary' variant='subtitle2'>Reading Community</Typography>
        </Box>
        <List>
          {items.map((e, i) => {
            const isActive = location.pathname === e.path;

            return (
              <ListItem key={i}>
                <ListItemButton
                  disabled={e.disabled}
                  onClick={() => navigate(e.path)}
                  sx={{
                    backgroundColor: isActive ? '#403d14' : 'transparent',
                    '&:hover': { backgroundColor: '#4d4a1a' },
                    borderRadius: 2,
                    color: !e.disabled ? 'white' : '#403d14'
                  }}
                >
                  <ListItemIcon sx={{ color: !e.disabled ? 'white' : '#403d14' }}>
                    {e.icon}
                  </ListItemIcon>
                  <ListItemText primary={e.title} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
