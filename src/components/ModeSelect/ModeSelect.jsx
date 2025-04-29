import { useColorScheme } from '@mui/material/styles'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'
import Box from '@mui/material/Box'

function ModeSelect() {
  const { mode, setMode } = useColorScheme()
  const handleChange = (event) => {
    const selectedMode = event.target.value
    setMode(selectedMode)
  }

  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel
        sx={{
          color: '#fff',
          '&.Mui-focused': { color: '#fff' }
        }}
        id="label-select-dart-light-mode">
        Mode
      </InputLabel>

      <Select
        labelId="label-select-dart-light-mode"
        id="select-dart-light-mode"
        value={mode}
        label="Mode"
        onChange={handleChange}
        sx={{
          color: '#fff',
          '.MuiOutlinedInput-notchedOutline': { borderColor: '#fff' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#fff' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#fff' },
          '.MuiSvgIcon-root': { color: '#fff' }
        }}>
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

export default ModeSelect
