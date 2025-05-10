import { Modal, Form, Input, Row, Col } from 'antd';
import { useEffect } from 'react';
import { UpdateUserPayload } from '../../types/user';

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: UpdateUserPayload) => void;
  initialValues?: UpdateUserPayload;
}

export function EditUserModal({ open, onClose, onSubmit, initialValues }: EditUserModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues]);

  return (
    <Modal
      title="Editar Usuário"
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Salvar"
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item name="name" label="Nome" rules={[{ required: true, message: 'O nome é obrigatório' }]}>
              <Input placeholder="Nome do usuário" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="phoneNumber" label="Telefone">
              <Input placeholder="(00) 00000-0000" maxLength={15} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="birthDate" label="Data de nascimento">
              <Input type="date" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="cpf" label="CPF">
              <Input placeholder="000.000.000-00" maxLength={14} />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="city" label="Cidade">
              <Input placeholder="Cidade" />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="state" label="Estado">
              <Input placeholder="UF (ex: SP)" maxLength={2} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
