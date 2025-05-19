import { Button, Form, Input, Typography, Card } from 'antd';
import { login } from '../../services/auth/authService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SweetAlert } from '../../components/SweetAlert/SweetAlert';
import { LoginPayload } from '../../types/user';
import Swal from 'sweetalert2';

export default function ExternalLoginPage() {
  const [searchParams, ] = useSearchParams()
  const app_name = searchParams.get('app_name')
  const redirectTo = searchParams.get('redirectTo')
  const navigate = useNavigate();

  const onSubmit = async (values: LoginPayload) => {
    SweetAlert.loading()
    try {
      const { data } = await login(values);

      Swal.close()

      if (data.user.role) {
        console.log(data)
        navigate('/portability/consent', {state: {
          appName: app_name, 
          token: data.acess_token,
          redirectTo
        } });
      } else {
        navigate('/unauthorized'); // fallback
      }

    } catch (error: any) {
      const apiError = error?.response?.data;

      const errorMessages = Array.isArray(apiError?.message)
        ? apiError.message.join('<br/>') // quebra de linha no HTML
        : apiError?.message || 'Erro ao realizar login';

      SweetAlert.error('Erro', errorMessages);
    }
  };

  return (
    <div
      style={{
        background: 'linear-gradient(to right, #e0eafc, #cfdef3)',
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
        <Typography.Title level={2} style={{ textAlign: 'center', marginBottom: 10, color: '#001529' }}>
          {app_name} deseja acessar seus dados
        </Typography.Title>
        <Typography.Text style={{ display: 'block', textAlign: 'center', marginBottom: 24 }}>
          Faça o login para permitir o acesso
        </Typography.Text>

        <Form onFinish={onSubmit} layout="vertical">
          <Form.Item
            label="E-mail"
            name="email"
            rules={[{ required: true, type: 'email', message: 'Informe um e-mail válido' }]}
          >
            <Input size="large" placeholder="email@empresa.com" />
          </Form.Item>

          <Form.Item
            label="Senha"
            name="password"
            rules={[{ required: true, message: 'Digite sua senha' }]}
          >
            <Input.Password size="large" placeholder="••••••••" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block style={{ background: '#001529' }}>
              Entrar
            </Button>
          </Form.Item>

        </Form>
      </Card>
    </div>
  );
}
