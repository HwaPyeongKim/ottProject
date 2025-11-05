import axios from "axios";
import { Cookies } from 'react-cookie'
const jaxios = axios.create()
const cookies = new Cookies()

const beforeReq = (config) => { 
    console.log("before request.............")
    // 쿠키에 있는 accessToken 을 jaxios 에 포함시켜서 리턴
    const loginUser = cookies.get('user')

    if( !loginUser || !loginUser.email ) {
        alert('로그인이 필요한 서비스 입니다')
        return Promise.reject(
            { response:{data:{error:"REQUIRE_LOGIN"}} }
        )
    }
    const {accessToken} = loginUser;
    config.headers.Authorization = `Bearer ${accessToken}`
    return config
}

const beforeRes = async (res) => {
    console.log("before return response...........")
    // 유효기간 만료된 결과가 오면 갱신
    let loginUser = cookies.get('user')
    const data = res.data
    if(data && data.error ==='ERROR_ACCESS_TOKEN'){
        const result = await axios.get(`/api/member/refresh/${loginUser.refreshToken}`,  {headers: {"Authorization":`Bearer ${loginUser.accessToken}`} } )
        loginUser.accessToken = result.data.accessToken;
        loginUser.refreshToken = result.data.refreshToken;
        cookies.set('user',  JSON.stringify( loginUser ), {path:'/',} )
        // 그리고 다시 요청
        const originalRequest = res.config
        originalRequest.headers.Authorization = `Bearer ${result.data.accessToken}`
        return await axios(originalRequest)
    }
    return res;
}


const requestFail = (err) => {
    console.log("reqeust fail error.............")
    return Promise.reject(err);
}
const responseFail = (err) => {
    console.log("response fail error.............")
    return Promise.reject(err);
}
jaxios.interceptors.request.use( beforeReq, requestFail )
jaxios.interceptors.response.use( beforeRes, responseFail)
export default jaxios