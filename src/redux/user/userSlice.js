import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROUTE } from '~/utils/constants'

const initialState = {
  currentUser: null
}

export const loginUserAPI = createAsyncThunk('user/loginUserAPI', async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROUTE}/v1/users/login`, data)
  return response.data
})

export const logoutUserAPI = createAsyncThunk('user/logoutUserAPI', async (showSuccessMessage = true) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROUTE}/v1/users/logout`)
  if (showSuccessMessage) toast.success('Logout successfully!')
  return response.data
})

export const updateUserAPI = createAsyncThunk('user/updateUserAPI', async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROUTE}/v1/users/update`, data)
  return response.data
})

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      const newUserInfo = action.payload
      state.currentUser = newUserInfo
    })
    builder.addCase(logoutUserAPI.fulfilled, (state) => {
      // clear currentUser của redux
      state.currentUser = null
    })
    builder.addCase(updateUserAPI.fulfilled, (state, action) => {
      const newUserInfo = action.payload
      state.currentUser = newUserInfo
    })
  }
})

// export const {} = userSlice.actions

export const selectCurrentUser = (state) => {
  return state.user.currentUser
}

export const userReducer = userSlice.reducer
