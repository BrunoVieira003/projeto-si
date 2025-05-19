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
        sub: string,
        name: string
        email: string
        cpf: string
        phone: string
}

async function getUserInfo(token: string): Promise<UserInfo>{
    try{
        const { data } = await axios.get(`http://localhost:8000/integration/info/${token}`)
        return data as UserInfo
    }catch(e){
        console.error(e)
        throw e
    }
}

async function getPortabilityToken(token: string){
    try{
        const { data } = await axios.post('http://localhost:8000/integration', {name: 'TalentsA'}, {headers: {Authorization: `Bearer ${token}`}})
        return data.token
    }catch(e){
        console.error(e)
        throw e
    }
}

export {EasyTermsApi, getUserInfo, getPortabilityToken}