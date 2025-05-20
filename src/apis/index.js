import axios from 'axios'
import { API_ROUTE } from '~/utils/constants'

// Boards
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROUTE}/v1/boards/${boardId}`)
  // axios trả về kết quả qua property của nó là data
  return response.data
}

// update columnOrderIds
export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await axios.put(`${API_ROUTE}/v1/boards/${boardId}`, updateData)
  return response.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await axios.put(`${API_ROUTE}/v1/boards/supports/moving-cards`, updateData)
  return response.data
}

// update cardOrderIds
export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await axios.put(`${API_ROUTE}/v1/columns/${columnId}`, updateData)
  return response.data
}

// Columns
export const createNewColumnAPI = async (newColumnData) => {
  const response = await axios.post(`${API_ROUTE}/v1/columns`, newColumnData)

  return response.data
}

// Cards
export const createNewCardAPI = async (newCardData) => {
  const response = await axios.post(`${API_ROUTE}/v1/cards`, newCardData)

  return response.data
}
