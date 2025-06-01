import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from './formatter'
import { logoutUserAPI } from '~/redux/user/userSlice'
import { refreshTokenAPI } from '~/apis'

/*
	* Không thể import {store} from '~/redux/store' theo cách thông thường vì đây là file js
	* Giải pháp: Inject store là kỹ thuật khi cần sử dụng biến redux store ở các file ngoài phạm vi component như file này
	* Khi ứng dụng bắt đầu chạy lên, code sẽ chạy vô main.jsx, từ bên đó chúng ta gọi hàm injectStore ngay lập tức để gán biến mainStore vào axiosReduxStore cục bộ trong file này.
	https://redux.js.org/faq/code-structure#how-can-i-use-the-redux-store-in-non-component-files
*/

let axiosReduxStore

export const injectStore = (mainStore) => {
  axiosReduxStore = mainStore
}

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

// khởi tạo một promise cho việc gọi api refresh-token
// mục đích tạo promise này để khi nào gọi api refresh-token xong thì mới retry lại các api bị lỗi trước đó
let refreshTokenPromise = null

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

    /** xử lý refreshToken tự động **/
    // trường hợp 1: nếu mã là 401 Unauthorized , gọi API đăng xuất
    if (error.response?.status === 401) {
      // do token có vấn đề cần đăng nhập lại nên ko show toast message
      axiosReduxStore.dispatch(logoutUserAPI(false))
    }

    // trường hợp 2: nếu mã là 410, gọi API refresh-token
    // đầu tiên lấy các request API đang lỗi thông qua error.config
    const originalRequests = error.config
    if (error.response?.status === 410 && !originalRequests._retry) {
      // gán thêm một giá trị _retry luôn = true trong khoảng thời gian chờ, để đảm bảo việc refresh-token này chỉ gọi api 1 lần tại 1 thời điểm
      originalRequests._retry = true

      // kiểm tra nếu chưa có refreshTokenPromise thì thực hiện gán việc gọi api refresh-token đồng thời lưu vào biến refreshTokenPromise
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshTokenAPI()
          .then((data) => {
            // đồng thời accessToken đã nằm trong httpOnly cookie (xử lý từ phía BE)
            return data?.accessToken
          })
          .catch(() => {
            // nếu nhận bất kì lỗi nào thì logout
            axiosReduxStore.dispatch(logoutUserAPI(false))
          })
          .finally(() => {
            // dù API có ok hay không thì vẫn gán lại refreshTokenPromise = null
            refreshTokenPromise = null
          })
      }

      // cần return trường hợp refreshTokenPromise đã chạy thành công và xử lý thêm ở đây
      // eslint-disable-next-line no-unused-vars
      return refreshTokenPromise.then((accessToken) => {
        // B1: đối với trường hợp nếu cần lưu accessToken vào localStorage hoặc đâu đó thì sẽ viết thêm code ở đây
        // hiện tại không cần b1 vì đã đưa accessToken vào cookie (xử lý từ phía BE) sau khi refresh-token API thành công

        // B2: Quan trọng: return lại axios instance kết hợp originalRequests để gọi lại các API bị lỗi trước đó
        return authorizedAxiosInstance(originalRequests)
      })
    }

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
