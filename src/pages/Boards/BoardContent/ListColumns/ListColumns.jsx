import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'

const ListColumns = ({ columns }) => {
  // SortableContext yêu cầu items là một mảng dạng ['id1', 'id2', 'id3'] chứ không phải là một mảng các object [{id: 'id1'}, {id: 'id2'}]
  // nếu không đúng thì vẫn kéo thả được nhưng không có animation
  // https://github.com/clauderic/dnd-kit/issues/183#issuecomment-812569512
  return (
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

        {/* Add new column */}
        <Box
          sx={{
            minWidth: '200px',
            maxWidth: '200px',
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
      </Box>
    </SortableContext>
  )
}

export default ListColumns
