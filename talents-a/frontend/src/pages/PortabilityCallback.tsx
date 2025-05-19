import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { SweetAlert } from "../components/SweetAlert/SweetAlert";
import { Spin } from "antd";
import { getPortabilityToken } from "../services/easy-terms";

export default function PortabilityCallback(){
    const [searchParams] = useSearchParams()
    const {login} = useAuth()
    const navigate = useNavigate()
    const [ready, setReady] = useState(false)
    const token = searchParams.get('token')

    const fetchUserInfo = async () => {
        try{
            if(token){
                const newToken = await getPortabilityToken(token)
                login(newToken)
                setReady(true)
            }
        }catch(e){
            console.error(e)
            SweetAlert.error('Ops!', 'Falha ao importar dados')
            navigate('/')
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