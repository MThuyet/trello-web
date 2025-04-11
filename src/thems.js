import { createTheme } from '@mui/material/styles'
import { blueGrey, red } from '@mui/material/colors'

// Create a theme instance.
const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'dark',
    primary: {
      main: blueGrey[500]
    },
    secondary: {
      main: '#19857b'
    },
    error: {
      main: red.A400
    },
    text: {
      secondary: red[500]
    }
  }
})

export default theme
