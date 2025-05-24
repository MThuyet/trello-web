import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'
import { createNewColumnAPI } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatter'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentActiveBoard, updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { cloneDeep } from 'lodash'

const ListColumns = ({ columns }) => {
  // redux
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)

  // đóng mở form tạo column
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)

  const [newColumnTitle, setNewColumnTitle] = useState('')

  // hàm tạo column
  const addNewColumn = async () => {
    if (!newColumnTitle) {
      toast.error('Please enter column title')
      return
    }

    // Tạo dữ liệu để call API
    const newColumnData = {
      title: newColumnTitle
    }

    // gọi API tạo mới column và làm lại dữ liệu state board
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    // xử lý kéo thả khi column mới được tạo nên rỗng
    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    // Đoạn này dính lỗi object is not extensible bởi dù đã clone ra giá trị mới nhưng bản chất của spread operator là shallow copy (https://www.javascripttutorial.net/object/3-ways-to-copy-objects-in-javascript/) nên dính phải rules Immutability của Redux Toolkits https://redux-toolkit.js.org/usage/immer-reducers, không được dùng hàm PUSH (sửa giá trị mảng trực tiếp), cách đơn giản là dùng Deep clone hoặc concat() để tạo mảng mới
    // const newBoard = { ...board }
    const newBoard = cloneDeep(board)
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)

    // cập nhật lại state board trong redux, newBoard là action.payload
    dispatch(updateCurrentActiveBoard(newBoard))

    // reset lại trạng thái
    setNewColumnTitle('')
    toggleOpenNewColumnForm()
  }

  return (
    // SortableContext yêu cầu items là một mảng dạng ['id1', 'id2', 'id3'] chứ không phải là một mảng các object [{id: 'id1'}, {id: 'id2'}]
    // nếu không đúng thì vẫn kéo thả được nhưng không có animation
    // https://github.com/clauderic/dnd-kit/issues/183#issuecomment-812569512
    <SortableContext items={columns?.map((column) => column._id)} strategy={horizontalListSortingStrategy}>
      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          bgcolor: 'inherit',
          width: '100%',
          height: '100%',
          '&::-webkit-scrollbar-track': { m: 2 }
        }}>
        {/* Columns */}
        {columns?.map((column) => (
          <Column key={column._id} column={column} />
        ))}

        {/* Box add new column */}
        {!openNewColumnForm ? (
          <Box
            onClick={toggleOpenNewColumnForm}
            sx={{
              minWidth: '250px',
              maxWidth: '250px',
              mx: 2,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: '#ffffff3d'
            }}>
            <Button
              sx={{
                color: '#fff',
                width: '100%',
                justifyContent: 'flex-start',
                pl: 2.5,
                py: 1
              }}
              startIcon={<NoteAddIcon />}>
              Add new column
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              minWidth: '250px',
              maxWidth: '250px',
              mx: 2,
              p: 1,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: '#ffffff3d',
              flexDirection: 'column',
              gap: 1
            }}>
            <TextField
              label="Enter column title..."
              type="text"
              size="small"
              variant="outlined"
              autoFocus
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              sx={{
                width: '100%',
                '& label': { color: '#fff' },
                '& input': { color: '#fff' },
                '& label.Mui-focused': { color: '#fff' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#fff' },
                  '&:hover fieldset': { borderColor: '#fff' },
                  '&.Mui-focused fieldset': { borderColor: '#fff' }
                }
              }}
            />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mt: 1
              }}>
              <Button
                className="interceptor-loading"
                onClick={addNewColumn}
                variant="contained"
                color="success"
                size="small"
                sx={{
                  boxShadow: 'none',
                  border: '0.5px solid',
                  borderColor: (theme) => theme.palette.success.main,
                  '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                }}>
                Add column
              </Button>
              <CloseIcon
                onClick={toggleOpenNewColumnForm}
                fontSize="small"
                sx={{
                  color: 'white',
                  cursor: 'pointer',
                  '&:hover': { color: (theme) => theme.palette.warning.light }
                }}
              />
            </Box>
          </Box>
        )}
      </Box>
    </SortableContext>
  )
}

export default ListColumns
