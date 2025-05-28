import { Button, Form, Input, Typography, Card } from 'antd';
import { login } from '../../services/auth/authService';
import { useNavigate } from 'react-router-dom';
import { SweetAlert } from '../../components/SweetAlert/SweetAlert';
import Swal from 'sweetalert2';
import { createIntegrationOrg } from '../../services/integrationsService';

export default function ExternalLoginPage() {
  const navigate = useNavigate();

  const onSubmit = async (values: any) => {
    SweetAlert.loading()
    try {
      await createIntegrationOrg(values);
      Swal.close()
      SweetAlert.success('Requisição enviada')


    } catch (error: any) {
      const apiError = error?.response?.data;

      const errorMessages = Array.isArray(apiError?.message)
        ? apiError.message.join('<br/>') // quebra de linha no HTML
        : apiError?.message || 'Erro ao enviar';

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
          Requisitar integração
        </Typography.Title>
        <Typography.Text style={{ display: 'block', textAlign: 'center', marginBottom: 24 }}>
          Preencha os dados abaixo para requisitar uma integração
        </Typography.Text>

        <Form onFinish={onSubmit} layout="vertical">
          <Form.Item
            label="Nome da organização"
            name="name"
            rules={[{ required: true, message: 'Digite o nome da organização' }]}
          >
            <Input size="large" placeholder="Empresa Inc." />
          </Form.Item>

          <Form.Item
            label="E-mail de contato"
            name="email"
            rules={[{ required: true, type: 'email', message: 'Informe um e-mail válido' }]}
          >
            <Input size="large" placeholder="email@empresa.com" />
          </Form.Item>

          <Form.Item
            label="Website"
            name="website"
            rules={[{ required: true, message: 'Informe o website da empresa' }]}
          >
            <Input size="large" placeholder="www.minhaempresa.com" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block style={{ background: '#001529' }}>
              Enviar
            </Button>
          </Form.Item>

        </Form>
      </Card>
    </div>
  );
}