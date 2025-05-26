import { Box, CircularProgress, Typography } from '@mui/material'

const PageLoadingSpinner = ({ caption }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
      <Typography sx={{ ml: 2 }}>{caption}</Typography>
    </Box>
  )
}

export default PageLoadingSpinner
