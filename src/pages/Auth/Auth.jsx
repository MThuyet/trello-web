import { Navigate, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import bgAuth from '~/assets/auth/login-register-bg.jpg'

const Auth = () => {
  const location = useLocation()
  // kiểm tra đường dẫn hiện tại đang là '/login' hay '/register'
  const isLogin = location.pathname === '/login'
  const isRegister = location.pathname === '/register'

  // nếu đã đăng nhập thì trả về trang chính
  const currentUser = useSelector(selectCurrentUser)
  if (currentUser) return <Navigate to="/" replace={true} />

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'flex-start',
        background: `url(${bgAuth})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.2)'
      }}>
      {isLogin && <LoginForm />}
      {isRegister && <RegisterForm />}
    </Box>
  )
}

export default Auth
