import { configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoard/activeBoardSlice'
import { userReducer } from './user/userSlice'
// redux persist
// https://edvins.io/how-to-use-redux-persist-with-redux-toolkit
import storage from 'redux-persist/lib/storage' // default là localStorage
import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'

// config persist
const rootPersistConfig = {
  key: 'root', // key của persist, mặc định là root
  storage: storage,
  whitelist: ['user'] // các slice được lưu trữ khi reload trang
}

// combine các reducers trong dự án
const reducers = combineReducers({
  activeBoard: activeBoardReducer,
  user: userReducer
})

// thực hiện persist
const persistedReducers = persistReducer(rootPersistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducers,
  // fix warning error when implement redux-persist
  // https://stackoverflow.com/a/63244831/8324172
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})
