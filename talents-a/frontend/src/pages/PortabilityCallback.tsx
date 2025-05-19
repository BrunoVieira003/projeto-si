import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { getUserInfo, getUserInfoFirstTime } from "../services/easy-terms";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { SweetAlert } from "../components/SweetAlert/SweetAlert";
import { Spin } from "antd";

export default function PortabilityCallback(){
    const [searchParams] = useSearchParams()
    const {login} = useAuth()
    const navigate = useNavigate()
    const [ready, setReady] = useState(false)
    const token = searchParams.get('token')

    const fetchUserInfo = async () => {
        try{
            if(token){
                const data = await getUserInfoFirstTime(token)
                login({access_token: token, userId: data.user.sub})
                setReady(true)
            }
        }catch(e){
            console.error(e)
            SweetAlert.error('Ops!', 'Falha ao importar dados')
            navigate('/login')
        }
    }

    useEffect(() => {
        fetchUserInfo()
    }, [])

    if(!ready){
        return <Spin/>
    }else{
        return <Navigate to="/profile"/>
    }
}