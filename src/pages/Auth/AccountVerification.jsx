import { useEffect, useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { verifyAccountAPI } from '~/apis'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'

const AccountVerification = () => {
  // Lấy email và token from url
  const [searchParams] = useSearchParams()

  // const email = searchParams.get('email')
  // const token = searchParams.get('token')

  // searchParams là một đối tượng đặc biệt. Có thể dùng spread (...) để chuyển nó thành mảng các cặp [key, value]
  // => [["email", "test@example.com"], ["token", "abc123"]]
  // Sau đó dùng Object.fromEntries() để biến mảng cặp key-value thành object
  // => { email: "test@example.com", token: "abc123" }
  const { email, token } = Object.fromEntries([...searchParams])

  // lưu trữ trạng thái verified
  const [verified, setVerified] = useState(false)

  // call API to verify account
  useEffect(() => {
    if (email && token) verifyAccountAPI({ email, token }).then(() => setVerified(true))
  }, [email, token])

  // if URL does not contain email or token, redirect to 404 page
  if (!email || !token) return <Navigate to={'/404'} replace={true} />

  // if not yet verified, show a loading indicator
  if (!verified) return <PageLoadingSpinner caption={'Verifying your account...'} />

  return <Navigate to={`/login?verifiedEmail=${email}`} />
}

export default AccountVerification
