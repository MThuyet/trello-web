import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  DndContext,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  getFirstCollision,
  pointerWithin
  // closestCenter
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatter'

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
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null) // lưu thông tin của column chứa card đang kéo
  const lastOverId = useRef(null) // điểm va chạm cuối cùng trước đó (xử lý thuật toán phát hiện va chạm)

  useEffect(() => {
    const orderedColumn = mapOrder(board?.columns, board?.columnOrderIds, '_id')
    setOrderedColumns(orderedColumn)
  }, [board])

  // bắt đầu kéo
  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
    // nếu là kéo card thì mới thực hiện set giá trị oldColumnWhenDraggingCard
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }

  // tìm column theo cardId
  const findColumnByCardId = (cardId) => {
    return orderedColumns.find((column) => column?.cards?.map((card) => card._id)?.includes(cardId))
  }

  // cập nhật lại state trong trường hợp di chuyển card giữa các column khác nhau
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
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

      // column gốc
      if (sourceColumn) {
        // xóa card ở column active (column cũ)
        sourceColumn.cards = sourceColumn.cards.filter((card) => card._id !== activeDraggingCardId)

        // thêm PlaceholderCard vào column nếu như column là rỗng, bị kéo hết card đi
        if (isEmpty(sourceColumn.cards)) {
          sourceColumn.cards = [generatePlaceholderCard(sourceColumn)]
        }
        // cập nhật lại mảng cardOrderIds cho column cũ
        sourceColumn.cardOrderIds = sourceColumn.cards.map((card) => card._id)
      }

      // column đích
      if (targetColumn) {
        // kiểm tra xem card đang kéo có tồn tại ở column hay chưa, nếu có cần phải xóa nó trước
        targetColumn.cards = targetColumn.cards.filter((card) => card._id !== activeDraggingCardId)

        // cập nhật lại vị trí columnId trong card sau khi kéo card giữa 2 column khác nhau
        const rebuild_activeDragingCardData = { ...activeDraggingCardData, columnId: targetColumn._id }

        // thêm card đang kéo vào overColumn theo vị trí index mới
        targetColumn.cards = targetColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDragingCardData)

        // xóa PlaceholderCard nếu nó đang tồn tại
        targetColumn.cards = targetColumn.cards.filter((card) => !card?.FE_PlaceholderCard)

        // cập nhật lại mảng cardOrderIds cho column over
        targetColumn.cardOrderIds = targetColumn.cards.map((card) => card._id)
      }

      return updatedColumns
    })
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
      moveCardBetweenDifferentColumns(overColumn, overCardId, active, over, activeColumn, activeDraggingCardId, activeDraggingCardData)
    }
  }

  // khi kéo xong
  const handleDragEnd = (event) => {
    const { active, over } = event

    if (!active || !over) return // nếu không tồn tại active hoặc over (khi kéo ra khỏi phạm vi container) thì không làm gì cả tránh crash trang

    // xử lý kéo thả cho card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
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

      // trong quá trình kéo thả, state đã bị thay đổi trong handleDragOver, nên khi kết thúc quá trình kéo cần phải biết card được kéo từ column nào chứ không chỉ là biết card đang ở column nào
      // => phải dùng activeDragItemData.columnId hoặc tạo state oldColumnWhenDraggingCard._id (set vào state từ bước handleDragStart) chứ không dùng activeData trong scope handleDragEnd này vì sau khi đi qua handleDragOver thì state của card đã bị cập nhật một lần rồi
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(overColumn, overCardId, active, over, activeColumn, activeDraggingCardId, activeDraggingCardData)
      } else {
        // kéo thả card trong cùng 1 column

        // Lấy vị trí current của card đang kéo trong column hiện tại
        const currentCardIndex = activeColumn?.cards?.findIndex((c) => c._id === activeDragItemId)
        // lấy vị trí mới từ over
        const newCardIndex = overColumn?.cards?.findIndex((c) => c._id === overCardId)

        // dùng arrayMove để sắp xếp lại vị trí mảng như đã kéo thả
        const dndOrderedCards = arrayMove(activeColumn.cards, currentCardIndex, newCardIndex)

        // cập nhật lại state columns
        setOrderedColumns((prevColumns) => {
          const updatedColumns = cloneDeep(prevColumns)

          // tìm tới column đích (tham chiếu đến đối tượng trong mảng orderedColumns)
          const targetColumn = updatedColumns.find((column) => column._id === overColumn._id)

          // cập nhật lại 2 giá trị mới là cards và cardOrderIds của column đích
          if (targetColumn) {
            targetColumn.cards = dndOrderedCards
            targetColumn.cardOrderIds = dndOrderedCards.map((card) => card._id)
          }

          // trả về state mới chuẩn vị trí, vì targetColumn đang là một đối tượng trong mảng orderedColumns, nên khi thay đổi thuộc tính của đối tượng(targetColumn) thì mảng orderedColumns cũng bị thay đổi theo
          return updatedColumns
        })
      }
    }

    // xử lý cho kéo thả column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      // nếu vị trí sau khi kéo khác với vị trí ban đầu -> action
      if (active.id !== over.id) {
        // lấy vị trí cũ từ active
        const oldColumnIndex = orderedColumns.findIndex((c) => c._id === active.id)
        // lấy vị trí mới từ over
        const newColumnIndex = orderedColumns.findIndex((c) => c._id === over.id)

        // dùng arrayMove để sắp xếp lại vị trí mảng như đã kéo thả
        // https://docs.dndkit.com/presets/sortable#overview
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
        setOrderedColumns(dndOrderedColumns)

        // const dndOrderedColumnsIds = dndOrderedColumns.map((column) => column._id)
        // console.log('dndOrderedColumnsIds', dndOrderedColumnsIds)
      }
    }

    // đưa tất cả về null khi kéo xong
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: { opacity: 0.5 }
      }
    })
  }

  // custom thuật toán phát hiện va chạm
  const collisionDetectionStrategy = useCallback(
    (args) => {
      // kéo thả column thì áp dụng closestCorners
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args })
      }

      // tìm các điểm giao nhau va chạm con trỏ (mảng)
      const poiterIntersection = pointerWithin(args)

      // khi kéo ra khỏi khu vực kéo thả hoặc poiterIntersection là mảng rỗng thì return
      if (!poiterIntersection?.length) return

      // thuật toán phát hiện va chạm sẽ trả về các mảng va chạm
      // const intersections = poiterIntersection.length > 0 ? poiterIntersection : rectIntersection(args)

      // tìm over id đầu tiên trong mảng poiterIntersection
      let overId = getFirstCollision(poiterIntersection, 'id')
      if (overId) {
        // nếu overId là column thì tìm tới cardId gần nhất bên trong khu vực va chạm đó dựa vào thuật toán phát hiện va chạm closestCorners hoặc closestCenter

        const checkColumn = orderedColumns.find((column) => column._id === overId)
        if (checkColumn) {
          // console.log('overIdBefore', overId)
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter((container) => {
              return container.id !== overId && checkColumn?.cardOrderIds?.includes(container.id)
            })
          })[0]?.id
          // console.log('overIdAfter', overId)
        }

        lastOverId.current = overId
        return [{ id: overId }]
      }

      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeDragItemType, orderedColumns]
  )

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      sensors={sensors}
      // thuật toán xử lý va chạm, dùng để fix card có ảnh cover không kéo qua column được vì bị conflict giữa card và columns
      // nếu chỉ dùng closestCorners sẽ có bug flickering + sai lệch dữ liệu
      // collisionDetection={closestCorners}

      // custom nâng cao thuật toán phát hiện va chạm https://github.com/clauderic/dnd-kit/blob/master/stories/2%20-%20Presets/Sortable/MultipleContainers.tsx
      collisionDetection={collisionDetectionStrategy}>
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
