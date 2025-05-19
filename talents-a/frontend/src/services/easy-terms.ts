import axios from 'axios';

const EasyTermsApi = axios.create({
  baseURL: 'http://localhost:8000',
});

EasyTermsApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface UserInfo{
    user: {
        sub: string,
        email: string
        role: string
    }
}
async function getUserInfo(): Promise<UserInfo>{
    try{
        const { data } = await EasyTermsApi.get('/users/profile')
        return data as UserInfo
    }catch(e){
        console.error(e)
        throw e
    }
}

async function getUserInfoFirstTime(token: string): Promise<UserInfo>{
    try{
        const { data } = await axios.get('http://localhost:8000/users/profile', {headers: {Authorization: `Bearer ${token}`}})
        return data as UserInfo
    }catch(e){
        console.error(e)
        throw e
    }
}

export {EasyTermsApi, getUserInfo, getUserInfoFirstTime}