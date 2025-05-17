import { Table, Card, Typography, Tag, Button} from 'antd';
import { useEffect, useState } from 'react';
import { getTermsAcceptanced, revokeConsent } from '../../services/termsAcceptance/termsAcceptanceService';
import { RevokeConsentModal } from '../../components/RevokeConsentModal/RevokeConsentModal';
import { useAuth } from '../../context/AuthContext';
import { OptionalFieldsModal } from '../../components/OptionalFieldsForm/Index';

const { Title } = Typography;

export default function TermsAcceptancePage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [fieldModalOpen, setFieldModalOpen] = useState(false);
  const [selectedFieldLog, setSelectedFieldLog] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await getTermsAcceptanced();

      // Se for EMPLOYEE, filtra apenas os logs dele
      const filteredLogs = user?.role === 'EMPLOYEE'
        ? response.data.filter((log: any) => log.user?.id === user.id)
        : response.data;

      setLogs(filteredLogs);
    } catch {
      console.error('Erro ao buscar histórico de termos aceitos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const openModal = (log: any) => {
    setSelectedLog(log);
    setModalOpen(true);
  };

  const handleRevoke = async () => {
    if (!selectedLog) return;
    try {
      await revokeConsent(selectedLog.id);
      setModalOpen(false);
      setSelectedLog(null);
      fetchLogs();
    } catch (err) {
      console.error('Erro ao revogar consentimento');
    }
  };

  const openFieldModal = (log: any) => {
    setSelectedFieldLog(log);
    setFieldModalOpen(true);
  };

  const columns = [
    {
      title: 'ID Usuário',
      dataIndex: ['user', 'id'],
      key: 'userId',
    },
    {
      title: 'ID Termo',
      dataIndex: ['term', 'id'],
      key: 'termId',
    },
    {
      title: 'Nome Termo',
      dataIndex: ['term', 'title'],
      key: 'termTitle',
    },
    {
      title: 'Versão',
      dataIndex: ['term', 'version'],
      key: 'version',
    },
    {
      title: 'Status',
      key: 'status',
      render: (_: any, record: any) => {
        if (record.revokedAt) {
          return <Tag color="red">Termo Revogado</Tag>;
        } else if (record.acceptedAt) {
          return <Tag color="green">Termo Aceito</Tag>;
        } else {
          return <Tag color="orange">Termo Pendente</Tag>;
        }
      },
    },
    {
      title: 'Data de aceitação',
      dataIndex: 'acceptedAt',
      key: 'acceptedAt',
      render: (value: string | null) =>
        value ? new Date(value).toLocaleString('pt-BR') : '-',
    },
    {
      title: 'Data de revogação',
      dataIndex: 'revokedAt',
      key: 'revokedAt',
      render: (value: string | null) =>
        value ? new Date(value).toLocaleString('pt-BR') : '-',
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: any) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            type="default"
            size="small"
            onClick={() => openFieldModal(record)}
            disabled={record.revokedAt}
          >
            Ver campos
          </Button>
          <Button
            danger
            size="small"
            onClick={() => openModal(record)}
            disabled={!record.acceptedAt || record.revokedAt}
          >
            Revogar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <Title level={3}>Histórico de Termos Aceitos</Title>

        <Table
          columns={columns}
          dataSource={logs}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 6 }}
        />

        <Button onClick={fetchLogs} type="primary">
          Atualizar Histórico
        </Button>

        <RevokeConsentModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={handleRevoke}
          userName={selectedLog?.user?.name || ''}
          termTitle={selectedLog?.term?.title || ''}
        />

        <OptionalFieldsModal
          open={fieldModalOpen}
          onClose={() => setFieldModalOpen(false)}
          record={selectedFieldLog}
        />
      </Card>
    </div>
  );
}
