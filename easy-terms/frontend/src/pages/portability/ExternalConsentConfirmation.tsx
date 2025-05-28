import { useLocation, useNavigate } from 'react-router-dom';
import { ReactElement, useEffect, useState } from 'react';
import { Button, Card, Flex, List, Spin, Typography } from 'antd';
import { MdOutlineEmail, MdOutlinePhoneEnabled } from 'react-icons/md';
import { FaRegUser } from 'react-icons/fa';

const dataFields: {fieldName: string, icon: ReactElement}[] = [
  {
    fieldName: 'Email',
    icon: <MdOutlineEmail size={24}/>
  },
  {
    fieldName: 'Nome',
    icon: <FaRegUser size={24}/>
  },
  {
    fieldName: 'CPF',
    icon: <FaRegUser size={24}/>
  },
  {
    fieldName: 'Telefone',
    icon: <MdOutlinePhoneEnabled size={24}/>
  }
]

export default function ConfirmExternalConsentPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const { state } = useLocation()
  const navigate = useNavigate()
  const appName: string | undefined = state.appName
  const token: string | undefined = state.token
  const redirectTo: string | undefined = state.redirectTo

  const redirectSuccess = () => {
    window.location.replace(`${redirectTo}?token=${token}`)
  }

  const redirectCancelled = () => {
    navigate('/')
  }
  
  useEffect(() => {
    console.log(token)
    const confirm = async () => {
      try {
        setStatus('success');
      } catch (err) {
        console.error(err);
        setStatus('error');
      }
    };

    confirm();
  }, []);

  if (status === 'loading') return <Spin fullscreen />;

  return (
    <div
      style={{
        height: '100vh',
        background: '#f5f5f5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 500,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          borderRadius: 12,
        }}
        actions={[
          <Flex justify='space-around' gap="small">
            <Button size='large' onClick={redirectCancelled}>Cancelar</Button>
            <Button type="primary" size='large' onClick={redirectSuccess}>Confirmar</Button>
          </Flex>
        ]}
        
        >
        <Typography.Title>{appName} acessará os seguintes dados</Typography.Title>
        <List
        dataSource={dataFields}
        renderItem={(item) => 
        <List.Item>
          <List.Item.Meta title={item.fieldName} avatar={item.icon} style={{alignItems: 'center', display: 'flex'}}/>
        </List.Item>}
        />
      </Card>
    </div>
  );
}
