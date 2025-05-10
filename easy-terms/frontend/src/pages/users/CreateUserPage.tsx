import { useEffect, useState } from 'react';
import {
    Form,
    Input,
    Select,
    Button,
    Card,
    Typography,
    Col,
    Row,
    Modal,
} from 'antd';
import { createUser } from '../../services/user/userService';
import { getTerms } from '../../services/term/termService';
import { CreateUserPayload } from '../../types/user';
import { SweetAlert } from '../../components/SweetAlert/SweetAlert';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const { Text, Link } = Typography;

export default function CreateUserPage() {
    const [form] = Form.useForm();
    const [terms, setTerms] = useState([]);
    const [_loading, setLoading] = useState(false);
    const [selectedTerm, setSelectedTerm] = useState<any | null>(null);
    const [acceptedIds, setAcceptedIds] = useState<string[]>([]);
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState<string>();

    const fetchTerms = async () => {
        setLoading(true);
        try {
            const { data } = await getTerms();
            setTerms(data.terms);
        } catch {
            SweetAlert.error('Erro', 'Erro ao carregar termos de consentimento');
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptTerm = (termId: string) => {
        const updated = [...new Set([...acceptedIds, termId])];
        setAcceptedIds(updated);
        form.setFieldsValue({ acceptedTermIds: updated });
        setSelectedTerm(null);
    };

    const onSubmit = async (values: CreateUserPayload) => {

        SweetAlert.loading();
        try {
            await createUser(values);

            await SweetAlert.success('Sucesso', 'Usuário criado com sucesso!');
            form.resetFields();
            setAcceptedIds([]);
        } catch (error: any) {
            const apiError = error?.response?.data;
            const errorMessages = Array.isArray(apiError?.message)
                ? apiError.message.join('<br/>')
                : apiError?.message || 'Erro ao criar usuário';

            SweetAlert.error('Erro', errorMessages);
        }
    };

    useEffect(() => {
        fetchTerms();
    }, []);

    const formatCPF = (value: string) =>
        value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1, 2})$/, '$1-$2');

    const formatPhoneNumber = (value: string) => {
        return value
            .replace(/\D/g, '') // remove tudo que não é número
            .replace(/^(\d{2})(\d)/, '($1) $2') // DDD
            .replace(/(\d{5})(\d)/, '$1-$2') // coloca o traço
            .slice(0, 15); // limita a 15 caracteres
    };

    return (
        <div
            style={{
                background: 'linear-gradient(to right, #e0eafc, #cfdef3)',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Card
                title="Cadastrar Novo Usuário"
                style={{
                    width: 1000,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    borderRadius: 12,
                    border: '1px solid #d0d0d0',
                    background: '#ffffffee',
                }}
            >
                <Form form={form} onFinish={onSubmit} layout="vertical">
                    <Row gutter={16}>
                        <Col xs={24} sm={24} md={8}>
                            <Form.Item
                                label="Nome"
                                name="name"
                                rules={[{ required: true, message: 'Por favor, insira o nome.' }]}
                            >
                                <Input placeholder="Digite um nome de usuário" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={8}>
                            <Form.Item
                                label="E-mail"
                                name="email"
                                rules={[
                                    { required: true, message: 'Por favor, insira o e-mail.' },
                                    { type: 'email', message: 'Formato de e-mail inválido.' },
                                ]}
                            >
                                <Input placeholder="Digite um e-mail para o usuário" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={8}>
                            <Form.Item
                                label="Senha"
                                name="password"
                                rules={[{ required: true, message: 'Por favor, insira a senha.' }]}
                            >
                                <Input.Password placeholder="Crie uma senha para o usuário" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={8}>
                            <Form.Item
                                label="Função"
                                name="role"
                                rules={[{ required: true, message: 'Por favor, selecione uma função.' }]}
                            >
                                <Select
                                    placeholder="Selecione uma função"
                                    onChange={(value) => setSelectedRole(value)}
                                >
                                    <Option value="ADMIN">Administrador</Option>
                                    <Option value="EMPLOYEE">Funcionário</Option>
                                </Select>
                            </Form.Item>

                        </Col>

                        <Col xs={24} sm={24} md={8}>
                            <Form.Item label="CPF (opcional)" name="cpf">
                                <Input
                                    maxLength={14}
                                    placeholder="000.000.000-00"
                                    onChange={(e) =>
                                        form.setFieldsValue({ cpf: formatCPF(e.target.value) })
                                    }
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={8}>
                            <Form.Item label="Data de nascimento (opcional)" name="birthDate">
                                <Input type="date" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={8}>
                            <Form.Item label="Telefone (opcional)" name="phoneNumber">
                                <Input
                                    maxLength={15}
                                    placeholder="(00) 00000-0000"
                                    onChange={(e) =>
                                        form.setFieldsValue({ phoneNumber: formatPhoneNumber(e.target.value) })
                                    }
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={8}>
                            <Form.Item label="Cidade (opcional)" name="city">
                                <Input placeholder="Informe a cidade" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={8}>
                            <Form.Item label="Estado (opcional)" name="state">
                                <Input placeholder="Ex: SP" maxLength={2} />
                            </Form.Item>
                        </Col>

                    </Row>

                    <Form.Item
                        label="Termos de consentimento:"
                        name="acceptedTermIds"
                        initialValue={[]}
                        rules={[]}
                    >
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 12,
                                maxHeight: 200,
                                overflowY: 'auto',
                                paddingRight: 8,
                            }}
                        >
                            {!selectedRole ? (
                                <div style={{ color: '#999', fontStyle: 'italic' }}>
                                    Selecione uma função para visualizar os termos disponíveis.
                                </div>
                            ) : terms.filter((term: any) =>
                                !term.appliesToRoles || term.appliesToRoles === selectedRole
                            ).length === 0 ? (
                                <div style={{ color: '#999', fontStyle: 'italic' }}>
                                    Nenhum termo disponível para a função selecionada.
                                </div>
                            ) : (
                                terms
                                    .filter((term: any) =>
                                        !term.appliesToRoles || term.appliesToRoles === selectedRole
                                    )
                                    .map((term: any) => {
                                        const alreadyAccepted = acceptedIds.includes(term.id);
                                        return (
                                            <div
                                                key={term.id}
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <div>
                                                    <strong>
                                                        - {term.title} (v.{term.version}) ({term.appliesToRoles ?? 'Todos'})
                                                    </strong>
                                                </div>
                                                {alreadyAccepted ? (
                                                    <span style={{ color: 'green', fontWeight: 'bold' }}>Aceito</span>
                                                ) : (
                                                    <Button type="link" onClick={() => setSelectedTerm(term)}>
                                                        Visualizar
                                                    </Button>
                                                )}
                                            </div>
                                        );
                                    })
                            )}

                        </div>
                    </Form.Item>

                    <Form.Item>
                        <Button htmlType="submit" type="primary" style={{ background: '#001529' }}>
                            Salvar
                        </Button>
                    </Form.Item>

                    <div style={{ textAlign: 'center', marginTop: 24 }}>
                        <Text>Já possui uma conta? </Text>
                        <Link onClick={() => navigate('/login')}>Clique aqui para fazer login</Link>
                    </div>
                </Form>
            </Card>

            <Modal
                open={!!selectedTerm}
                onCancel={() => setSelectedTerm(null)}
                title={selectedTerm?.title}
                footer={[
                    <Button key="cancel" onClick={() => setSelectedTerm(null)}>
                        Cancelar
                    </Button>,
                    <Button
                        key="accept"
                        type="primary"
                        onClick={() => handleAcceptTerm(selectedTerm.id)}
                    >
                        Aceitar Termo
                    </Button>,
                ]}
                width={700}
            >
                <div style={{ whiteSpace: 'pre-wrap', marginBottom: 16 }}>
                    <p><strong>Versão:</strong> {selectedTerm?.version}</p>
                    <p><strong>Finalidade:</strong> {selectedTerm?.purpose}</p>
                    <p><strong>Revogável:</strong> {selectedTerm?.revocable ? 'Sim' : 'Não'}</p>
                    <p><strong>Requer opt-in:</strong> {selectedTerm?.requiresOptIn ? 'Sim' : 'Não'}</p>
                    <p><strong>Aceite obrigatório:</strong> {selectedTerm?.acceptanceRequired === true ? 'Sim' : selectedTerm?.acceptanceRequired === false ? 'Não' : '-'}</p>
                    <p><strong>Válido de:</strong> {selectedTerm?.validFrom ? new Date(selectedTerm.validFrom).toLocaleDateString('pt-BR') : '-'}</p>
                    <p><strong>Válido até:</strong> {selectedTerm?.validUntil ? new Date(selectedTerm.validUntil).toLocaleDateString('pt-BR') : '-'}</p>
                </div>

                <div style={{ borderTop: '1px solid #ccc', paddingTop: 12 }}>
                    <p style={{ marginBottom: 8 }}><strong>Conteúdo:</strong></p>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{selectedTerm?.content}</div>
                </div>
            </Modal>

        </div>
    );
}
