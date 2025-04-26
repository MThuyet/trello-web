import Box from '@mui/material/Box'

const BoardContent = () => {
  return (
    <Box
      sx={{
        backgroundColor: 'primary.main',
        widows: '100%',
        height: (them) => `calc(100vh - ${them.trello.appBarHeight} - ${them.trello.boardBarHeight})`,
        display: 'flex',
        alignItems: 'center'
      }}>
      Board Content
    </Box>
  )
}

export default BoardContent
