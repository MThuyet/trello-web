import { useState } from 'react'
import TextField from '@mui/material/TextField'

// thay vì phải tạo biến State để chuyển đổi qua lại giữa thẻ Input và Text thông thường, thì CSS lại cho cái thẻ Input trông như text bình thường, chỉ khi click và focus vào nó thì style lại trở về như cái input ban đầu.
// Controlled Input trong MUI: https://mui.com/material-ui/react-text-field/#uncontrolled-vs-controlled
const ToggleFocusInput = ({ value, onChangedValue, inputFontSize = '16px', ...props }) => {
  const [inputValue, setInputValue] = useState(value)

  const triggerBlur = () => {
    // Support Trim dữ liệu State inputValue sau khi blur ra ngoài
    setInputValue(inputValue.trim())

    // Nếu giá trị không có gì thay đổi hoặc Nếu user xóa hết nội dung thì set lại giá trị gốc ban đầu theo value từ props và return
    if (!inputValue || inputValue.trim() === value) {
      setInputValue(value)
      return
    }

    // Khi giá trị có thay đổi thì gọi lên func ở Props cha để xử lý
    onChangedValue(inputValue)
  }

  return (
    <TextField
      id="toggle-focus-input-controlled"
      fullWidth
      variant="outlined"
      size="small"
      value={inputValue}
      onChange={(event) => {
        setInputValue(event.target.value)
      }}
      onBlur={triggerBlur}
      {...props}
      sx={{
        '& label': {},
        '& input': { fontSize: inputFontSize, fontWeight: 'bold' },
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'transparent',
          '& fieldset': { borderColor: 'transparent' }
        },
        '& .MuiOutlinedInput-root:hover': {
          borderColor: 'transparent',
          '& fieldset': { borderColor: 'transparent' }
        },
        '& .MuiOutlinedInput-root.Mui-focused': {
          backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#33485D' : 'white'),
          '& fieldset': { borderColor: 'primary.main' }
        },
        '& .MuiOutlinedInput-input': {
          px: '6px',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis'
        }
      }}
    />
  )
}

export default ToggleFocusInput
