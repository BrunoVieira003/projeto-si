import { useEffect, useState } from 'react';
import { Table, Form, Input, Button, Card, Tag, Modal } from 'antd';
import { createTerm, getTerms } from '../../services/term/termService';
import { CreateTermPayload } from '../../types/term';
import { SweetAlert } from '../../components/SweetAlert/SweetAlert';

export default function TermsPage() {
  const [form] = Form.useForm();
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(false);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<string>('');

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
  }, []);

  const columns = [
    {
      title: 'Título',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: 'Versão',
      dataIndex: 'version',
      key: 'version'
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

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {/* Card do formulário */}
        <Card
          title="Cadastrar Novo Termo"
          style={{ flex: 1, minWidth: 300 }}
        >
          <Form form={form} onFinish={onSubmit} layout="vertical">
            <Form.Item
              label="Título"
              name="title"
              rules={[{ required: true, message: 'Por favor, insira o título.' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Conteúdo"
              name="content"
              rules={[{ required: true, message: 'Por favor, insira o conteúdo do termo.' }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ background: '#001529' }}>
                Salvar
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* Card da Tabela */}
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
          />
        </Card>

        <Modal
          open={viewModalOpen}
          onCancel={() => setViewModalOpen(false)}
          footer={null}
          title="Conteúdo do Termo"
          width={800}
        >
          <div style={{ whiteSpace: 'pre-wrap' }}>{selectedContent}</div>
        </Modal>

      </div>
    </div>
  );
}  
