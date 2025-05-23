import Board from '~/pages/Boards/_id'
import { Routes, Route, Navigate } from 'react-router-dom'
import NotFound from './pages/404/NotFound'
import Auth from './pages/Auth/Auth'

function App() {
  return (
    <Routes>
      {/* / => /boards/682e95bd685331a06ca8d306
				Sử dụng replace={true} để không lưu lại history của browser
			*/}
      <Route path="/" element={<Navigate to="/boards/682e95bd685331a06ca8d306" />} replace={true} />

      {/* Auth */}
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />

      {/* Board Details */}
      <Route path="/boards/:boardId" element={<Board />} />

      {/* 404 not found */}
      {/* Khi người dùng truy cập vào một route không tồn tại thì * sẽ match vào đây */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
