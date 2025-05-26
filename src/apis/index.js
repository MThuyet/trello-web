import { toast } from 'react-toastify'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROUTE } from '~/utils/constants'

// update columnOrderIds
export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROUTE}/v1/boards/${boardId}`, updateData)
  return response.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROUTE}/v1/boards/supports/moving-cards`, updateData)
  return response.data
}

// update cardOrderIds
export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await authorizedAxiosInstance.put(`${API_ROUTE}/v1/columns/${columnId}`, updateData)
  return response.data
}

// Columns
export const createNewColumnAPI = async (newColumnData) => {
  const response = await authorizedAxiosInstance.post(`${API_ROUTE}/v1/columns`, newColumnData)
  return response.data
}

// delete column
export const deleteColumnAPI = async (columnId) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROUTE}/v1/columns/${columnId}`)
  return response.data
}

// Cards
export const createNewCardAPI = async (newCardData) => {
  const response = await authorizedAxiosInstance.post(`${API_ROUTE}/v1/cards`, newCardData)
  return response.data
}

// register account
export const registerAccountAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROUTE}/v1/users/register`, data)
  if (response.data) toast.success('Register successfully! Please check your email to verify account', { theme: 'colored' })
  return response.data
}

// verify account
export const verifyAccountAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROUTE}/v1/users/verify`, data)
  if (response.data) toast.success('Verify account successfully! Now you can login to enjoy Trello', { theme: 'colored' })
  return response.data
}
