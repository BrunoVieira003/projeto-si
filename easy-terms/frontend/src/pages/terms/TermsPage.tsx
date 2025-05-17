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

  const fieldTypes = [
    { label: 'Texto', value: 'string' },
    { label: 'Número', value: 'number' },
    { label: 'Booleano', value: 'boolean' },
    { label: 'Data', value: 'date' }
  ];

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
            </Row>

            {/* Campos personalizados */}
            <Row>
              <Col span={24}>
                <Form.List name="customFields">
                  {(fields, { add, remove }) => (
                    <>
                      <div style={{ marginBottom: 8 }}>
                        <Button onClick={() => add()} type="dashed">+ Adicionar campo opcional</Button>
                      </div>
                      {fields.map(({ key, name, ...restField }) => (
                        <Row key={key} gutter={16} align="middle">
                          <Col xs={24} sm={6}>
                            <Form.Item
                              {...restField}
                              name={[name, 'name']}
                              rules={[{ required: true, message: 'Nome obrigatório' }]}
                            >
                              <Input placeholder="Nome do campo" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={10}>
                            <Form.Item
                              {...restField}
                              name={[name, 'content']}
                              rules={[{ required: true, message: 'Conteúdo obrigatório' }]}
                            >
                              <Input placeholder="Valor" />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={6}>
                            <Form.Item
                              {...restField}
                              name={[name, 'type']}
                              rules={[{ required: true, message: 'Tipo obrigatório' }]}
                            >
                              <Select placeholder="Tipo do campo">
                                {fieldTypes.map(ft => (
                                  <Option key={ft.value} value={ft.value}>{ft.label}</Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={2}>
                            <Button danger onClick={() => remove(name)}>Remover</Button>
                          </Col>
                        </Row>
                      ))}
                    </>
                  )}
                </Form.List>
              </Col>
            </Row>

            <Col xs={24} style={{ marginTop: 24 }}>
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
