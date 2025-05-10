import { useEffect, useState } from 'react';
import { Table, Form, Input, Button, Card, Tag, Modal, Select, Col, Row } from 'antd';
import { createTerm, getTerms } from '../../services/term/termService';
import { CreateTermPayload } from '../../types/term';
import { SweetAlert } from '../../components/SweetAlert/SweetAlert';
import { getUsers } from '../../services/user/userService';

const { Option } = Select;

export default function TermsPage() {
  const [form] = Form.useForm();
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(false);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<string>('');

  const [adminUsers, setAdminUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const { data } = await getUsers();
      const admins = data.users.filter((user: any) => user.role === 'ADMIN');
      setAdminUsers(admins);
    } catch (err) {
      SweetAlert.error('Erro ao carregar usuários', 'Tente novamente mais tarde');
    }
  };

  const fetchTerms = async () => {
    setLoading(true);
    try {
      const { data } = await getTerms();
      setTerms(data.terms);
    } catch (err) {
      SweetAlert.error('Erro ao carregar termos', 'Tente novamente mais tarde');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: CreateTermPayload) => {
    SweetAlert.loading();
    try {
      await createTerm(values);

      SweetAlert.success('Sucesso!', 'Termo criado com sucesso!');
      form.resetFields();
      fetchTerms();
    } catch {
      SweetAlert.error('Erro ao criar termo', 'Verifique os dados e tente novamente');
    }
  };

  useEffect(() => {
    fetchTerms();
    fetchUsers();
  }, []);

  const columns = [
    {
      title: 'Título',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: 'Conteúdo',
      dataIndex: 'content',
      key: 'content',
      render: (content: string) => (
        <div
          onClick={() => {
            setSelectedContent(content);
            setViewModalOpen(true);
          }}
          style={{
            maxWidth: 200,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            color: '#1890ff'
          }}
        >
          {'Ver conteúdo'}
        </div>
      )
    },
    {
      title: 'Versão',
      dataIndex: 'version',
      key: 'version'
    },
    {
      title: 'Finalidade',
      dataIndex: 'purpose',
      key: 'purpose',
    },
    {
      title: 'Revogável?',
      dataIndex: 'revocable',
      key: 'revocable',
      render: (requiresOptIn: boolean) =>
        requiresOptIn ? (
          <Tag color="green">SIM</Tag>
        ) : (
          <Tag color="red">NÃO</Tag>
        ),
    },
    {
      title: 'Criado Por',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: 'Ativo',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) =>
        isActive ? (
          <Tag color="green">Ativo</Tag>
        ) : (
          <Tag color="red">Inativo</Tag>
        ),
    },
    {
      title: 'Data de Criação',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value: string) => new Date(value).toLocaleString('pt-BR'),
    },
    {
      title: 'Perfil Associado',
      dataIndex: 'appliesToRoles',
      key: 'appliesToRoles',
      render: (value: string | null | undefined) =>
        value === 'ADMIN' ? (
          <Tag color="green">Administrador</Tag>
        ) : value === 'EMPLOYEE' ? (
          <Tag color="blue">Funcionário</Tag>
        ) : (
          '-'
        ),
    },
    {
      title: 'Data Inicial Validade',
      dataIndex: 'validFrom',
      key: 'validFrom',
      render: (value: string) => value ? new Date(value).toLocaleDateString('pt-BR') : '-',
    },
    {
      title: 'Data Final Validade',
      dataIndex: 'validUntil',
      key: 'validUntil',
      render: (value: string) => value ? new Date(value).toLocaleDateString('pt-BR') : '-',
    },
    {
      title: 'Aceite obrigatório?',
      dataIndex: 'acceptanceRequired',
      key: 'acceptanceRequired',
      render: (value: boolean | null | undefined) =>
        value === true ? (
          <Tag color="green">SIM</Tag>
        ) : value === false ? (
          <Tag color="red">NÃO</Tag>
        ) : (
          '-'
        )
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 16 }}>Gerenciar Termos de Uso</h1>
        <p style={{ fontSize: 16, marginBottom: 16 }}>
          Aqui você pode cadastrar novos termos de uso e visualizar os já cadastrados.
        </p>
        <span>Observação: Ao criar um novo termo com um título já existente, o sistema automaticamente incrementa a versão do termo.</span>
      </div>

      <div>
        {/* Card do formulário */}
        <Card title="Cadastrar Novo Termo" style={{ flex: 1, minWidth: 300 }}>
          <Form form={form} onFinish={onSubmit} layout="vertical">
            <Row gutter={16}>

              <Col xs={24} sm={24} md={8}>
                <Form.Item
                  label="Título"
                  name="title"
                  rules={[{ required: true, message: 'Por favor, insira o título.' }]}
                >
                  <Input placeholder="Insira um título para o termo" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={8}>
                <Form.Item
                  label="Conteúdo"
                  name="content"
                  rules={[{ required: true, message: 'Por favor, insira o conteúdo do termo.' }]}
                >
                  <Input placeholder='Insira um conteúdo para o termo' />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={8}>
                <Form.Item
                  label="Finalidade"
                  name="purpose"
                  rules={[{ required: true, message: 'Por favor, informe a finalidade do termo.' }]}
                >
                  <Input placeholder="Ex: Consentimento para envio de comunicações" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={8}>
                <Form.Item
                  label="Revogável?"
                  name="revocable"
                  rules={[{ required: true, message: 'Por favor, selecione se é revogável.' }]}
                >
                  <Select placeholder="Selecione uma opção">
                    <Option value={true}>Sim</Option>
                    <Option value={false}>Não</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={8}>
                <Form.Item
                  label="Criado por (administrador)"
                  name="createdBy"
                  rules={[{ required: true, message: 'Selecione o administrador responsável.' }]}
                >
                  <Select placeholder="Selecione um administrador">
                    {adminUsers.map((user: any) => (
                      <Option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

              </Col>

              <Col xs={24} sm={24} md={8}>
                <Form.Item label="Aplica-se ao perfil (opcional)" name="appliesToRoles">
                  <Select placeholder="Selecione um perfil (opcional)" allowClear>
                    <Option value="ADMIN">Administrador</Option>
                    <Option value="EMPLOYEE">Funcionário</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={8}>
                <Form.Item label="Data inicial de validade (opcional)" name="validFrom">
                  <Input type="date" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={8}>
                <Form.Item label="Data final de validade (opcional)" name="validUntil">
                  <Input type="date" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={8}>
                <Form.Item label="Aceite obrigatório? (opcional)" name="acceptanceRequired">
                  <Select placeholder="Selecione uma opção" allowClear>
                    <Option value={true}>Sim</Option>
                    <Option value={false}>Não</Option>
                  </Select>
                </Form.Item>
              </Col>

            </Row>

            <Col xs={24} sm={24} md={8}>
              <Form.Item>
                <Button type="primary" htmlType="submit" style={{ background: '#001529' }}>
                  Salvar
                </Button>
              </Form.Item>
            </Col>

          </Form>
        </Card>

        {/* Card da Tabela */}
        < div style={{ marginTop: 20 }
        }>
          <Card
            title="Termos Cadastrados"
            style={{ flex: 2 }}
          >
            <Table
              columns={columns}
              dataSource={terms}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 5 }}
              scroll={{ x: 'max-content' }}
            />
          </Card>
        </div >

        <Modal
          open={viewModalOpen}
          onCancel={() => setViewModalOpen(false)}
          footer={null}
          title="Conteúdo do Termo"
          width={800}
        >
          <div style={{ whiteSpace: 'pre-wrap' }}>{selectedContent}</div>
        </Modal>

      </div >
    </div >
  );
}  
