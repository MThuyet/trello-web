import axios from 'axios'
import { API_ROUTE } from '~/utils/constants'

export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROUTE}/v1/boards/${boardId}`)
  // axios trả về kết quả qua property của nó là data
  return response.data
}
