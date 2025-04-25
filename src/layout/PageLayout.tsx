import { Box, Typography } from '@mui/material'
import React from 'react'

interface PageLayoutProps {
  title: string
  children: React.ReactNode
}

const PageLayout: React.FC<PageLayoutProps> = ({ title, children }) => {
  return (
    <Box>
      {/* <Box>
        <Typography sx={{
          fontSize: 22,
          fontWeight: 'bold',
          color: '#403d14'
        }}>{title}</Typography>
      </Box> */}
      <Box sx={{ p: 1}}>
        {children}
      </Box>
    </Box>
  )
}

export default PageLayout