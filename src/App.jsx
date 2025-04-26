import { useColorScheme } from '@mui/material/styles'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'

function ModeSelect() {
  const { mode, setMode } = useColorScheme()
  const handleChange = (event) => {
    const selectedMode = event.target.value
    setMode(selectedMode)
  }

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="label-select-dart-light-mode">Mode</InputLabel>
      <Select labelId="label-select-dart-light-mode" id="select-dart-light-mode" value={mode} label="Mode" onChange={handleChange}>
        <MenuItem value="light">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LightModeIcon fontSize="small" />
            Light
          </Box>
        </MenuItem>
        <MenuItem value="dark">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DarkModeIcon fontSize="small" />
            Dark
          </Box>
        </MenuItem>
        <MenuItem value="system">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SettingsBrightnessIcon fontSize="small" />
            System
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  )
}

function App() {
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh', backgroundColor: 'primary.main' }}>
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
      <Box
        sx={{
          backgroundColor: 'primary.dark',
          widows: '100%',
          height: (theme) => theme.trello.boardBarHeight,
          display: 'flex',
          alignItems: 'center'
        }}>
        Board Bar
      </Box>
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
    </Container>
  )
}

export default App
