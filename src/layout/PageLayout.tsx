import { Logout } from '@mui/icons-material'
import { Box, Button, Typography } from '@mui/material'
import React from 'react'

interface PageLayoutProps {
  title: string
  children: React.ReactNode
}

const PageLayout: React.FC<PageLayoutProps> = ({ title, children }) => {
  return (
    <Box>
      <Box sx={{bgcolor: '', mb: 1.5, display:'flex', justifyContent: 'space-between'}}>
        <Typography sx={{
          fontSize: 22,
          fontWeight: 'bold',
          color: '#403d14'
        }}>{title}</Typography>

        <Button startIcon={<Logout />} variant='outlined' sx={{ color: '#ef4444', borderColor: '#ef4444'}}>Logout</Button>
      </Box>
      <Box sx={{ p: 1}}>
        {children}
      </Box>
    </Box>
  )
}

export default PageLayout