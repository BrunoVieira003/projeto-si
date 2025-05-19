import { Flex, List, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { getUserInfo, UserInfo } from "../services/easy-terms";
import { SweetAlert } from "../components/SweetAlert/SweetAlert";
import { Navigate } from "react-router-dom";

export default function Profile(){
    const [userData, setUserData] = useState<UserInfo>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const fetchUserInfo = async () => {
        try{
            const data = await getUserInfo()
            setUserData(data)
            setLoading(false)
        }catch(e){
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
        </Flex>
    )
}