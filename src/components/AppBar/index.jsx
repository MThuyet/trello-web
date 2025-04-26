import Box from '@mui/material/Box'
import ModeSelect from '~/components/ModeSelect'

const AppBar = () => {
  return (
    <Box
      sx={{
        backgroundColor: 'primary.light',
        widows: '100%',
        height: (theme) => theme.trello.appBarHeight,
        display: 'flex',
        alignItems: 'center'
      }}>
      <ModeSelect />
    </Box>
  )
}

export default AppBar
