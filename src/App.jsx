import Board from '~/pages/Boards/_id'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import NotFound from './pages/404/NotFound'
import Auth from './pages/Auth/Auth'
import AccountVerification from './pages/Auth/AccountVerification'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import Settings from './pages/Settings/Settings'
import Boards from './pages/Boards'

// Protected Route chỉ cho truy cập nếu đã login
const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to="/login" replace={true} />
  // Outlet là một thành phần (component) đặc biệt được sử dụng để hiển thị các route con (nested routes) bên trong một route cha.
  return <Outlet />
}

function App() {
  const currentUser = useSelector(selectCurrentUser)

  return (
    <Routes>
      {/* Sử dụng replace={true} để không lưu lại history của browser */}
      <Route path="/" element={<Navigate to="/boards" />} replace={true} />

      {/* Auth */}
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />
      {/* Verify */}
      <Route path="/account/verification" element={<AccountVerification />} />

      <Route element={<ProtectedRoute user={currentUser} />}>
        {/* Board Details */}
        <Route path="/boards/:boardId" element={<Board />} />
        {/* Board list */}
        <Route path="/boards" element={<Boards />} />

        {/* Account Setting */}
        <Route path="/settings/account" element={<Settings />} />
        <Route path="/settings/security" element={<Settings />} />
      </Route>

      {/* 404 not found */}
      {/* Khi người dùng truy cập vào một route không tồn tại thì * sẽ match vào đây */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
