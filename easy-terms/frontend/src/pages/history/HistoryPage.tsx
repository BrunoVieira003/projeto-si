import { useEffect, useState } from 'react';
import { Table, Tabs, Card, Tag, Typography, Button, Space } from 'antd';
import { getAllHistoryLogs } from '../../services/history/historyService';

const { TabPane } = Tabs;
const { Title } = Typography;

export default function HistoryPage() {
    const [userLogs, setUserLogs] = useState([]);
    const [termLogs, setTermLogs] = useState([]);
    const [acceptanceLogs, setAcceptanceLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await getAllHistoryLogs();
            const allLogs = res.data;

            setUserLogs(allLogs.filter((log: any) => log.entity === 'User'));
            setTermLogs(allLogs.filter((log: any) => log.entity === 'Term'));
            setAcceptanceLogs(allLogs.filter((log: any) => log.entity === 'Acceptance'));
        } catch {
            console.error('Erro ao carregar logs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const actionTagMap: Record<string, { text: string; color: string }> = {
        CREATE_USER: { text: 'Usuário criado', color: 'green' },
        UPDATE_USER: { text: 'Usuário atualizado', color: 'blue' },
        CREATE_TERM: { text: 'Termo criado', color: 'cyan' },
        UPDATE_TERM: { text: 'Termo atualizado', color: 'gold' },
        ACCEPT_TERM_FIELD: { text: 'Campo aceito', color: 'green' },
        ACCEPT_TERM: { text: 'Termo Aceito', color: 'green' },
        REVOKE_TERM: { text: 'Termo Revogado', color: 'red' },
        REVOKE_TERM_FIELD: { text: 'Campo revogado', color: 'red' },
    };

    const renderDetails = (data: any, record: any) => {
        if (!data) return '-';

        if (record.entity === 'User') {
            return (
                <>
                    <div><strong>Nome:</strong> {data.name}</div>
                    <div><strong>Email:</strong> {data.email}</div>
                    <div><strong>Função:</strong> {data.role}</div>
                </>
            );
        }

        if (record.entity === 'Term') {
            return (
                <>
                    <div><strong>Título:</strong> {data.title}</div>
                    <div><strong>Versão:</strong> {data.version}</div>
                    <div><strong>Conteúdo:</strong> {data.content}</div>
                    <div><strong>Campos Opcionais:</strong></div>
                    <ul style={{ paddingLeft: 20 }}>
                        {Array.isArray(data.customFields) && data.customFields.length > 0 ? (
                            data.customFields.map((field: any) => (
                                <li key={field.id}>
                                    <strong>{field.name}</strong> ({field.type}): {field.value}
                                </li>
                            ))
                        ) : (
                            <li>Nenhum campo opcional definido.</li>
                        )}
                    </ul>
                </>
            );
        }

        if (record.entity === 'Acceptance') {
            if (record.action === 'ACCEPT_TERM_FIELD' || record.action === 'REVOKE_TERM_FIELD') {
                return (
                    <>
                        <div><strong>Campo:</strong> {data?.customField?.name}</div>
                        <div><strong>Valor:</strong> {data?.customField?.value ?? '-'}</div>
                        <div><strong>Termo:</strong> {data?.userTermAcceptance?.term?.title}</div>
                        <div><strong>Versão Termo:</strong> {data?.userTermAcceptance?.term?.version}</div>
                        <div><strong>Usuário:</strong> {data?.userTermAcceptance?.user?.name}</div>
                        <div><strong>Data de Aceite:</strong> {data?.acceptedAt ? new Date(data.acceptedAt).toLocaleString('pt-BR') : '-'}</div>
                        <div><strong>Data da Revogação:</strong> {data?.revokedAt ? new Date(data.revokedAt).toLocaleString('pt-BR') : '-'}</div>
                    </>
                );
            }

            if (record.action === 'ACCEPT_TERM' || record.action === 'REVOKE_TERM') {
                return (
                    <>
                        <div><strong>Termo:</strong> {data?.term?.title}</div>
                        <div><strong>Versão:</strong> {data?.term?.version}</div>
                        <div><strong>Conteúdo:</strong> {data?.term?.content}</div>
                        <div><strong>Usuário:</strong> {data?.user?.name} ({data?.user?.email})</div>
                        <div><strong>Data de Aceite:</strong> {data?.acceptedAt ? new Date(data.acceptedAt).toLocaleString('pt-BR') : '-'}</div>
                        <div><strong>Data da Revogação:</strong> {data?.revokedAt ? new Date(data.revokedAt).toLocaleString('pt-BR') : '-'}</div>
                        <div><strong>Campos Opcionais:</strong></div>
                        <ul style={{ paddingLeft: 20 }}>
                            {Array.isArray(data?.term?.customFields) && data.term.customFields.length > 0 ? (
                                data.term.customFields.map((field: any) => (
                                    <li key={field.id}>
                                        <strong>{field.name}</strong> ({field.type}): {field.value}
                                    </li>
                                ))
                            ) : (
                                <li>Nenhum campo opcional definido.</li>
                            )}
                        </ul>
                    </>
                );
            }
        }

        return (
            <pre style={{ maxWidth: 300, whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(data, null, 2)}
            </pre>
        );
    };

    const columns = [
        {
            title: 'Ação',
            dataIndex: 'action',
            key: 'action',
            render: (action: string) => {
                const tagInfo = actionTagMap[action] ?? { text: action, color: 'default' };
                return <Tag color={tagInfo.color}>{tagInfo.text}</Tag>;
            },
        },
        {
            title: 'Entidade',
            dataIndex: 'entity',
            key: 'entity',
        },
        {
            title: 'Responsável / Usuário',
            key: 'user',
            render: (_: any, record: any) => {
                const data = record.data;
                if (record.entity === 'User') return data?.name ?? '-';
                if (record.entity === 'Acceptance') {
                    return data?.user?.name || data?.userTermAcceptance?.user?.name || '-';
                }
                return '-';
            },
        },
        {
            title: 'Data e Horário',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (value: string | null) =>
                value ? new Date(value).toLocaleString('pt-BR') : '-',
        },
        {
            title: 'Detalhes',
            dataIndex: 'data',
            key: 'details',
            render: renderDetails,
        },
    ];

    return (
        <div>
            <Card>
                <Space style={{ justifyContent: 'space-between', width: '100%' }} direction="vertical">
                    <Title level={3}>Histórico de Alterações</Title>
                    <Button onClick={fetchLogs} loading={loading}>Atualizar</Button>
                </Space>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Usuários" key="1">
                        <Table
                            dataSource={userLogs}
                            columns={columns}
                            rowKey="id"
                            loading={loading}
                            pagination={{ pageSize: 5 }}
                        />
                    </TabPane>
                    <TabPane tab="Termos" key="2">
                        <Table
                            dataSource={termLogs}
                            columns={columns}
                            rowKey="id"
                            loading={loading}
                            pagination={{ pageSize: 5 }}
                        />
                    </TabPane>
                    <TabPane tab="Aceites" key="3">
                        <Table
                            dataSource={acceptanceLogs}
                            columns={columns}
                            rowKey="id"
                            loading={loading}
                            pagination={{ pageSize: 5 }}
                        />
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    );
}
