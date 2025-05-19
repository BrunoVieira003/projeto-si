import { Button, Form, Typography, Card } from 'antd';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Login() {
  const {authenticated} = useAuth()

  if(authenticated){
    return <Navigate to="/profile"/>
  }

  const onSubmit = async () => {
    window.location.assign(`http://localhost:5173/portability/login?app_name=TalensA&redirectTo=http://localhost:5174/portability/callback/`)
  }

  return (
    <div
      style={{
        background: '#e7f7e7',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card
        style={{
          width: 400,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          borderRadius: 12,
          border: '1px solid #d0d0d0',
          background: '#ffffffee',
        }}
      >
        <Typography.Title level={2} style={{ textAlign: 'center', marginBottom: 10, color: '#00290a' }}>
          TalentsA
        </Typography.Title>
        <Typography.Text style={{ display: 'block', textAlign: 'center', marginBottom: 24 }}>
          Banco de talentos. Escolha uma das opções para entrar
        </Typography.Text>

        <Form onFinish={onSubmit} layout="vertical">
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block style={{ background: '#002918' }}>
              Entrar com Easy Terms
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
