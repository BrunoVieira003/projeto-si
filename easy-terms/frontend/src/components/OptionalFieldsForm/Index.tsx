import { Modal, Table, Tag, Button, Space } from 'antd';
import { useState, useEffect } from 'react';
import { TermAcceptanceLog } from '../../types/term-acceptance';
import {
  updateAcceptedFields,
  revokeCustomFieldConsent,
} from '../../services/termsAcceptance/termsAcceptanceService';
import { SweetAlert } from '../SweetAlert/SweetAlert';

export function OptionalFieldsModal({
  open,
  onClose,
  record,
}: {
  open: boolean;
  onClose: () => void;
  record: TermAcceptanceLog | null;
}) {
  const [customFields, setCustomFields] = useState<any[]>([]);

  useEffect(() => {
    if (record) {
      const acceptedMap = new Map(
        (record.acceptedCustomFields || []).map((f) => [f.customField.id, f])
      );

      const merged = record.term.customFields.map((field) => {
        const matched = acceptedMap.get(field.id);
        return {
          key: field.id,
          id: matched?.id || null,
          accepted: matched?.accepted ?? false,
          acceptedAt: matched?.acceptedAt || null,
          revokedAt: matched?.revokedAt || null,
          customField: field,
        };
      });

      setCustomFields(merged);
    }
  }, [record]);

  const handleAcceptField = async (fieldId: string) => {
    const acceptedIds = [...customFields]
      .filter((f) => f.accepted)
      .map((f) => f.customField.id);

    const newAcceptedIds = [...new Set([...acceptedIds, fieldId])];

    try {
      await updateAcceptedFields(record!.id, newAcceptedIds);

      setCustomFields((prev) =>
        prev.map((field) =>
          field.customField.id === fieldId
            ? {
                ...field,
                accepted: true,
                acceptedAt: new Date().toISOString(),
                revokedAt: null,
              }
            : field
        )
      );

      SweetAlert.success("Sucesso", "Campo aceito com sucesso");
    } catch {
      SweetAlert.error("Erro", "Erro ao aceitar o campo");
    }
  };

  const handleRevokeField = async (fieldId: string) => {
    try {
      await revokeCustomFieldConsent(record!.id, fieldId);

      setCustomFields((prev) =>
        prev.map((field) =>
          field.customField.id === fieldId
            ? {
                ...field,
                accepted: false,
                revokedAt: new Date().toISOString(),
              }
            : field
        )
      );

      SweetAlert.success("Sucesso", "Campo revogado com sucesso");
    } catch {
      SweetAlert.error("Erro", "Erro ao revogar o campo");
    }
  };

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
      render: (_: any, row: any) =>
        row.accepted ? <Tag color="green">Aceito</Tag> : <Tag color="red">Não aceito</Tag>,
    },
    {
      title: 'Aceito em',
      dataIndex: 'acceptedAt',
      key: 'acceptedAt',
      render: (value: string | null) =>
        value ? new Date(value).toLocaleString('pt-BR') : '-',
    },
    {
      title: 'Revogado em',
      dataIndex: 'revokedAt',
      key: 'revokedAt',
      render: (value: string | null) =>
        value ? new Date(value).toLocaleString('pt-BR') : '-',
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, row: any) => (
        <Space>
          <Button
            size="small"
            type="primary"
            disabled={row.accepted}
            onClick={() => handleAcceptField(row.customField.id)}
          >
            Aceitar
          </Button>
          <Button
            size="small"
            danger
            disabled={!row.accepted}
            onClick={() => handleRevokeField(row.customField.id)}
          >
            Revogar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={`Campos opcionais - ${record?.term.title} (v${record?.term.version})`}
      width={850}
    >
      <Table
        columns={columns}
        dataSource={customFields}
        rowKey="customField.id"
        pagination={false}
      />
    </Modal>
  );
}
