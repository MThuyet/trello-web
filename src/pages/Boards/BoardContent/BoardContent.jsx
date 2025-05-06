import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { useEffect, useState } from 'react'
import { DndContext, useSensor, useSensors, MouseSensor, TouchSensor, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

const BoardContent = ({ board }) => {
  // https://docs.dndkit.com/api-documentation/sensors#usesensors
  // fix khi click cũng kích hoạt event nhưng còn bug
  // const pointerSensor = useSensor(PointerSensor, {
  //   activationConstraint: {
  //     distance: 10 // khoảng cách di chuyển tối thiểu 10px để kích hoạt kéo thả
  //   }
  // })

  // ưu tiên sử dụng mouseSensor và toachSensor để có trải nghiệm trên mobile tốt hơn

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10
    }
  })

  const toachSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250, // nhấn giữ khoảng 250ms để kích hoạt kéo thả
      tolerance: 500
    }
  })

  const sensors = useSensors(mouseSensor, toachSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  // cùng một thời điểm chỉ có một item đang kéo thả
  const [activeDragItemId, setActiveDragItemId] = useState(null)

  const [activeDragItemType, setActiveDragItemType] = useState(null)

  const [activeDragItemData, setActiveDragItemData] = useState(null)

  useEffect(() => {
    const orderedColumn = mapOrder(board?.columns, board?.columnOrderIds, '_id')
    setOrderedColumns(orderedColumn)
  }, [board])

  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (!over) return // nếu kéo đến vị trí không xác định

    // nếu vị trí sau khi kéo khác với vị trí ban đầu -> action
    if (active.id !== over.id) {
      // lấy vị trí cũ từ active
      const oldIndex = orderedColumns.findIndex((c) => c._id === active.id)
      // lấy vị trí mới từ over
      const newIndex = orderedColumns.findIndex((c) => c._id === over.id)

      // dùng arrayMove để sắp xếp lại vị trí mảng như đã kéo thả
      // https://docs.dndkit.com/presets/sortable#overview
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)
      setOrderedColumns(dndOrderedColumns)

      // const dndOrderedColumnsIds = dndOrderedColumns.map((column) => column._id)
      // console.log('dndOrderedColumnsIds', dndOrderedColumnsIds)
    }

    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
  }

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: { opacity: 0.5 }
      }
    })
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} sensors={sensors}>
      <Box
        sx={{
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
          widows: '100%',
          height: (theme) => theme.trello.boardContentHeight,
          p: '10px 0'
        }}>
        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && <Column column={activeDragItemData} />}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
