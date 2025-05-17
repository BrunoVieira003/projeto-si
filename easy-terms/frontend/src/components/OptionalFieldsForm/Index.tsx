import { Modal, Table, Tag } from 'antd';
import { TermAcceptanceLog } from '../../types/term-acceptance';

export function OptionalFieldsModal({ open, onClose, record }: {
  open: boolean;
  onClose: () => void;
  record: TermAcceptanceLog | null;
}) {
  if (!record) return null;

  const columns = [
    {
      title: 'Campo',
      dataIndex: ['customField', 'name'],
      key: 'name',
    },
    {
      title: 'Valor',
      dataIndex: ['customField', 'value'],
      key: 'value',
    },
    {
      title: 'Status',
      key: 'accepted',
      render: (_: any, row: any) => {
        return row.accepted
          ? <Tag color="green">Aceito</Tag>
          : <Tag color="red">Revogado</Tag>;
      }
    },
    {
      title: 'Data de aceite',
      dataIndex: 'acceptedAt',
      key: 'acceptedAt',
      render: (value: string | null) =>
        value ? new Date(value).toLocaleString('pt-BR') : '-'
    },
    {
      title: 'Data de revogação',
      dataIndex: 'revokedAt',
      key: 'revokedAt',
      render: (value: string | null) =>
        value ? new Date(value).toLocaleString('pt-BR') : '-'
    }
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={`Campos opcionais - ${record.term.title} (v${record.term.version})`}
      width={800}
    >
      <Table
        columns={columns}
        dataSource={record.acceptedCustomFields}
        rowKey="id"
        pagination={false}
      />
    </Modal>
  );
}
