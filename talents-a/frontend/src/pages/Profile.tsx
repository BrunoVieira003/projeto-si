import { Button, Flex, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { getUserInfo, UserInfo } from "../services/easy-terms";
import { SweetAlert } from "../components/SweetAlert/SweetAlert";
import { Navigate, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { useAuth } from "../context/AuthContext";

export default function Profile(){
    const [userData, setUserData] = useState<UserInfo>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const {logout} = useAuth()
    const navigate = useNavigate()

    const fetchUserInfo = async () => {
        try{
            const data = await getUserInfo()
            setUserData(data)
            setLoading(false)
        }catch(e){
            if(e instanceof AxiosError){
                if(e.status === 401){
                    logout()
                    navigate('/')
                }
            }
            setError(true)
        }
    }

    useEffect(() => {
        fetchUserInfo()
    }, [])

    if(loading){
        return <Spin/>
    }

    if(error){
        SweetAlert.error('Erro', 'Erro ao carregar dados')
        return <Navigate to="/"/>
    }

    
    return (
        <Flex vertical style={{margin: 100}} align="center">
            <Typography.Title>Perfil</Typography.Title>
            <Flex vertical>
                <Typography.Title level={4}>Email</Typography.Title>
                <Typography.Text>{userData?.user.email}</Typography.Text>
            </Flex>
            <Button onClick={logout}>Logout</Button>
        </Flex>
    )
}