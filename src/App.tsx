import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  return (
    <Container
      sx={{
        backgroundColor: '#FFE6D5',
        height: '100vh',
      }}>
      <Box>
        <Sidebar />
        <Typography color='#58551E'>
          Mumbai Bookies Admin Dashboard
        </Typography>
      </Box>
    </Container>
  );
};

export default App;