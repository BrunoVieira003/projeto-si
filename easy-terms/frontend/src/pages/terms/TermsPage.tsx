import { useEffect, useState } from 'react';
import {
  Table, Form, Input, Button, Card, Tag, Modal, Col, Row,
  Divider,
} from 'antd';
import { createTerm, getTerms } from '../../services/term/termService';
import { CreateTermPayload } from '../../types/term';
import { SweetAlert } from '../../components/SweetAlert/SweetAlert';
import { getUsers } from '../../services/user/userService';
import { DeleteOutlined } from '@ant-design/icons';

export default function TermsPage() {
  const [form] = Form.useForm();
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(false);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<string>('');

  const [customFieldsModalOpen, setCustomFieldsModalOpen] = useState(false);
  const [selectedCustomFields, setSelectedCustomFields] = useState<any[]>([]);

  const [, setAdminUsers] = useState([]);

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
      const loggedUser = JSON.parse(localStorage.getItem("user") || "{}");

      const payload: CreateTermPayload = {
        ...values,
        createdBy: loggedUser?.id || "",
        customFields: values.customFields?.map((field) => ({
          ...field,
          type: 'boolean'
        })) || []
      };

      await createTerm(payload);

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

  // const fieldTypes = [
  //   { label: 'Texto', value: 'string' },
  //   { label: 'Número', value: 'number' },
  //   { label: 'Booleano', value: 'boolean' },
  //   { label: 'Data', value: 'date' }
  // ];

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
      title: 'Campos Opcionais',
      dataIndex: 'customFields',
      key: 'customFields',
      render: (fields: any[]) =>
        fields && fields.length > 0 ? (
          <Button type="link" onClick={() => {
            setSelectedCustomFields(fields);
            setCustomFieldsModalOpen(true);
          }}>
            Visualizar ({fields.length})
          </Button>
        ) : (
          <Tag color="default">Nenhum</Tag>
        ),
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
        <Card title="Cadastrar Novo Termo" style={{ flex: 1, width: 700 }}>
          <Form form={form} onFinish={onSubmit} layout="vertical">
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Título"
                  name="title"
                  rules={[{ required: true, message: 'Por favor, insira o título.' }]}
                >
                  <Input placeholder="Insira um título para o termo" />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item
                  label="Conteúdo"
                  name="content"
                  rules={[{ required: true, message: 'Por favor, insira o conteúdo do termo.' }]}
                >
                  <Input.TextArea
                    rows={6}
                    placeholder="Descreva aqui o conteúdo detalhado do termo"
                    style={{ resize: 'vertical' }}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">Campos Opcionais</Divider>
            <Form.List name="customFields">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row
                      key={key}
                      gutter={12}
                      align="middle"
                      style={{ marginBottom: 8 }}
                    >
                      <Col xs={24} sm={6}>
                        <Form.Item
                          {...restField}
                          name={[name, 'name']}
                          rules={[{ required: true, message: 'Nome obrigatório' }]}
                        >
                          <Input placeholder="Nome do campo" />
                        </Form.Item>
                      </Col>

                      <Col xs={24} sm={16}>
                        <Form.Item
                          {...restField}
                          name={[name, 'value']}
                          rules={[{ required: true, message: 'Valor obrigatório' }]}
                        >
                          <Input placeholder="Valor do campo" />
                        </Form.Item>
                      </Col>

                      <Col xs={24} sm={2}>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '25px' }}>
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => remove(name)}
                          />
                        </div>
                      </Col>
                    </Row>
                  ))}

                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block>
                      + Adicionar campo opcional
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Form.Item style={{ marginTop: 24 }}>
              <Button type="primary" htmlType="submit" style={{ background: '#001529' }}>
                Salvar
              </Button>
            </Form.Item>
          </Form>
        </Card>


        {/* Card da Tabela */}
        <div style={{ marginTop: 20 }}>
          <Card title="Termos Cadastrados" style={{ flex: 2 }}>
            <Table
              bordered
              columns={columns}
              dataSource={terms}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 5 }}
              scroll={{ x: 'max-content' }}
            />
          </Card>
        </div>

        {/* Modal de conteúdo */}
        <Modal
          open={viewModalOpen}
          onCancel={() => setViewModalOpen(false)}
          footer={null}
          title="Conteúdo do Termo"
          width={800}
        >
          <div style={{ whiteSpace: 'pre-wrap' }}>{selectedContent}</div>
        </Modal>

        {/* Modal de campos personalizados */}
        <Modal
          open={customFieldsModalOpen}
          onCancel={() => setCustomFieldsModalOpen(false)}
          footer={null}
          title="Campos Personalizados"
          width={600}
        >
          {selectedCustomFields.length === 0 ? (
            <p>Nenhum campo personalizado definido.</p>
          ) : (
            <ul>
              {selectedCustomFields.map((field, index) => (
                <li key={index}>
                  <strong>{field.name}</strong> ({field.type}): {field.value}
                </li>
              ))}
            </ul>
          )}
        </Modal>
      </div>
    </div>
  );
}
