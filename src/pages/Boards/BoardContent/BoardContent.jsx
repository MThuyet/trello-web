import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { useEffect, useState } from 'react'
import { DndContext, useSensor, useSensors, MouseSensor, TouchSensor, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep } from 'lodash'

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

  const [orderedColumns, setOrderedColumns] = useState([]) // danh sách các cột

  // cùng một thời điểm chỉ có một item đang kéo thả
  const [activeDragItemId, setActiveDragItemId] = useState(null)

  const [activeDragItemType, setActiveDragItemType] = useState(null) // loại item đang kéo thả

  const [activeDragItemData, setActiveDragItemData] = useState(null) // dữ liệu item đang kéo thả

  useEffect(() => {
    const orderedColumn = mapOrder(board?.columns, board?.columnOrderIds, '_id')
    setOrderedColumns(orderedColumn)
  }, [board])

  // bắt đầu kéo
  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
  }

  // tìm column theo cardId
  const findColumnByCardId = (cardId) => {
    return orderedColumns.find((column) => column?.cards?.map((card) => card._id)?.includes(cardId))
  }

  // trong khi kéo
  const handleDragOver = (event) => {
    // nếu kéo column thì không xử lý
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return
    }

    // đối với card
    const { active, over } = event

    if (!active || !over) return

    // card đang được kéo
    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData }
    } = active

    // card đang tương tác (được kéo qua)
    const { id: overCardId } = over

    // tìm 2 column active và over theo card
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    // nếu không tìm thấy 1 trong 2 column -> return
    if (!activeColumn || !overColumn) return

    // chỉ khi đang kéo card qua column khác thì mới xử lý
    if (activeColumn._id !== overColumn._id) {
      setOrderedColumns((currentColumns) => {
        // tìm vị trí (index) của overCard trong column đích (nơi card sắp được thả)
        const overCardIndex = overColumn?.cards?.findIndex((card) => card._id === overCardId)

        // tính toán vị trí mới cho thẻ đang kéo (lấy chuẩn từ thư viện)
        let newCardIndex

        const isBelowOverItem = active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height

        const modifier = isBelowOverItem ? 1 : 0

        newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

        // clone mảng orderedColumns cũ ra một mảng mới để xử lý data rồi return - cập nhật lại orderedColumns
        const updatedColumns = cloneDeep(currentColumns)
        // column gốc
        const sourceColumn = updatedColumns.find((column) => column._id === activeColumn._id)
        // column đích
        const targetColumn = updatedColumns.find((column) => column._id === overColumn._id)

        if (sourceColumn) {
          // xóa card ở column active (column cũ)
          sourceColumn.cards = sourceColumn.cards.filter((card) => card._id !== activeDraggingCardId)

          // cập nhật lại mảng cardOrderIds cho column cũ
          sourceColumn.cardOrderIds = sourceColumn.cards.map((card) => card._id)
        }
        if (targetColumn) {
          // kiểm tra xem card đang kéo có tồn tại ở column hay chưa, nếu có cần phải xóa nó trước
          targetColumn.cards = targetColumn.cards.filter((card) => card._id !== activeDraggingCardId)

          // thêm card đang kéo vào overColumn theo vị trí index mới
          targetColumn.cards = targetColumn.cards.toSpliced(newCardIndex, 0, activeDraggingCardData)

          // cập nhật lại mảng cardOrderIds cho column over
          targetColumn.cardOrderIds = targetColumn.cards.map((card) => card._id)
        }

        return updatedColumns
      })
    }
  }

  // khi kéo xong
  const handleDragEnd = (event) => {
    // nếu kéo card thì không xử lý
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      return
    }

    const { active, over } = event

    // xử lý cho kéo thả column
    if (!active || !over) return // nếu kéo đến vị trí không xác định

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
    <DndContext onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd} sensors={sensors}>
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
