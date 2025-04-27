import { Lock } from '@mui/icons-material'
import { Box, Button, Card, FormControl, InputLabel, Select, TextField, Typography } from '@mui/material'
import React from 'react'
import BookiesLogo from "../assets/bookies_logo.png"


const Auth = () => {
  return (
    <Box sx={{
      display: 'grid',
      placeItems: 'center',
      height: '100vh',
      bgcolor: '#FFE6D5'
    }}>
      <Box sx={{ display: 'grid', gap: 4, mt: -16 }}>
        <Box sx={{ p: 2, fontWeight: 'bold', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <img src={BookiesLogo} style={{ blockSize: 100 }} />
          <Typography color='primary' sx={{ fontSize: 28, fontWeight: 'bold', textTransform: 'uppercase' }}>Mumbai Bookies</Typography>
          <Typography color='primary' variant='subtitle2'>Admin Dashboard</Typography>
        </Box>

        <Card sx={{
          boxShadow: 'none',
          width: 400,
          p: 3,
          borderRadius: 3
        }}>
          <Box sx={{
            display: 'grid',
            placeItems: 'center',
            gap: 2
          }}>
            <Lock fontSize='large' color='primary' />

            <FormControl fullWidth>
              <InputLabel id="email-col-label">Select City</InputLabel>
              <Select sx={{ bgcolor: 'whitesmoke' }} label="Select City" />
            </FormControl>

            <TextField fullWidth sx={{ bgcolor: 'whitesmoke' }} label="Passkey"/>

            <Button variant='contained' fullWidth sx={{py: 1.5}}>Continue</Button>
          </Box>
        </Card>
      </Box>
    </Box>
  )
}

export default Auth