import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const App: React.FC = () => {
  return (
    <Container
      sx={{
        backgroundColor: '#FFE6D5',
        minWidth: '100%',
        height: '100vh',
        display: 'grid',
        placeItems: 'center'
      }}>
      <Box>
        <Typography color='#58551E'>
          Mumbai Bookies Admin Dashboard
        </Typography>
      </Box>
    </Container>
  );
};

export default App;