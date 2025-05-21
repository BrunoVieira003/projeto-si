import { useEffect, useState } from 'react';
import { Table, Tabs, Card, Tag, Typography } from 'antd';
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
        REVOKE_TERM_FIELD: { text: 'Campo revogado', color: 'red' },
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
            title: 'Data e Horário',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (value: string | null) =>
                value ? new Date(value).toLocaleString('pt-BR') : '-',
        },
        {
            title: 'Dados Criados/Alterados',
            dataIndex: 'data',
            key: 'data',
            render: (data: any, record: any) => {
                if (!data) return '-';

                if (record.entity === 'User') {
                    return (
                        <div>
                            <div><strong>Nome:</strong> {data.name}</div>
                            <div><strong>Email:</strong> {data.email}</div>
                            <div><strong>Função:</strong> {data.role}</div>
                        </div>
                    );
                }

                if (record.entity === 'Term') {
                    return (
                        <div>
                            <div><strong>Título:</strong> {data.title}</div>
                            <div><strong>Versão:</strong> {data.version}</div>
                            <div><strong>Conteúdo:</strong> {data.content}</div>
                            <div><strong>Itens Opcionais:</strong></div>
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
                        </div>
                    );
                }

                if (record.entity === 'Acceptance') {
                    return (
                        <div>
                            <div><strong>Campo:</strong> {data?.customField?.name}</div>
                            <div><strong>Valor:</strong> {data?.customField?.value ?? '-'}</div>
                            <div><strong>Termo:</strong> {data?.userTermAcceptance?.term?.title}</div>
                            <div><strong>Usuário:</strong> {data?.userTermAcceptance?.user?.name}</div>
                        </div>
                    );
                }

                // fallback
                return (
                    <pre style={{ maxWidth: 300, whiteSpace: 'pre-wrap' }}>
                        {JSON.stringify(data, null, 2)}
                    </pre>
                );
            }
        }
    ];

    return (
        <div>
            <Card>
                <Title level={3}>Histórico de Alterações</Title>
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
