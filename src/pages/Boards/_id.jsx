// Board Details
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { useEffect } from 'react'
import { updateBoardDetailsAPI, updateColumnDetailsAPI, moveCardToDifferentColumnAPI } from '~/apis'
import { Box, Typography } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBoardDetailsAPI, selectCurrentActiveBoard, updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { cloneDeep } from 'lodash'
import { useParams } from 'react-router-dom'

const Board = () => {
  const dispatch = useDispatch()
  // lấy dữ liệu board từ redux
  const board = useSelector(selectCurrentActiveBoard)

  // lấy boardId từ url
  const { boardId } = useParams()

  // call api fetch board details
  useEffect(() => {
    // sử dụng dispatch để gọi các function của redux
    dispatch(fetchBoardDetailsAPI(boardId))
  }, [dispatch, boardId])

  // gọi API sắp xếp lại khi kéo thả column xong
  const moveColumn = (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)

    // set lại state trước
    const newBoard = cloneDeep(board)
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    dispatch(updateCurrentActiveBoard(newBoard))

    // call API update
    updateBoardDetailsAPI(board._id, { columnOrderIds: dndOrderedColumnsIds })
  }

  // di chuyển card trong cùng 1 column, gọi API cập nhật mảng cardOrderIds trong column chứa card
  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    // update chuẩn dữ liệu state
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find((column) => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    dispatch(updateCurrentActiveBoard(newBoard))

    // call API tới backend
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
  }

  // di chuyển card sang column khác
  const moveCardToDifferentColumn = (currentCardId, originalColumnId, newColumnId, dndOrderedColumns) => {
    /*
			B1: Cập nhật lại mảng cardOrderIds trong column gốc (xóa _id của card ra khỏi mảng cardOrderIds)
			B2: Cập nhật lại mảng cardOrderIds trong column đích (thêm _id của card vào mảng cardOrderIds)
			B3: Cập nhật lại columnId của card thay đổi
		*/

    // set state
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)

    const newBoard = cloneDeep(board)
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    dispatch(updateCurrentActiveBoard(newBoard))

    // gọi API cập nhật
    let originalCardOrderIds = dndOrderedColumns.find((c) => c._id === originalColumnId).cardOrderIds
    // nếu mảng chỉ chứa placeholder card do front-end tạo ra thì xóa đi
    if (originalCardOrderIds[0].includes('placeholder-card')) originalCardOrderIds = []

    moveCardToDifferentColumnAPI({
      currentCardId,
      originalColumnId,
      originalCardOrderIds,
      newColumnId,
      newCardOrderIds: dndOrderedColumns.find((c) => c._id === newColumnId).cardOrderIds
    })
  }

  if (!board) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading Board...</Typography>
      </Box>
    )
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        // vì chỉ truyền props xuống 1 cấp nên có thể để
        moveColumn={moveColumn}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  )
}

export default Board
