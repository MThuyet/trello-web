import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from './formatter'

// khởi tạo một đối tượng Axios (authorizedAxiosInstance) mục đích để custom và cấu hình chung cho dự án
let authorizedAxiosInstance = axios.create()

// thời gian chờ tối đa của 1 request là 10p
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10
// withCredentials: Sẽ cho phép Axios tự động gửi cookie trong mỗi request lên BE (phục vụ việc lưu JWT token (refresh & accept) vào trong httpOnly Cookie của trình duyệt)
authorizedAxiosInstance.defaults.withCredentials = true

// cấu hình interceptors
// Add a request interceptor (can thiệp vào giữa những request)
authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    // chặn spam click
    interceptorLoadingElements(true)
    return config
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Add a response interceptor (can thiệp vào giữa response nhận về)
authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    // sau khi có response thì trả về trạng thái như ban đầu
    interceptorLoadingElements(false)
    return response
  },
  (error) => {
    // có lỗi cũng trả về trạng thái như ban đầu
    interceptorLoadingElements(false)

    // xử lý lỗi tập trung nếu có từ phần trả về của mọi API
    let errorMessage = error?.response?.data?.message || error?.message
    // ngoại trừ status lỗi 410 (GONE) phục vụ việc tự refresh lại token
    if (error.response?.status !== 410) {
      toast.error(errorMessage || 'Something went wrong')
    }

    return Promise.reject(error)
  }
)

export default authorizedAxiosInstance
