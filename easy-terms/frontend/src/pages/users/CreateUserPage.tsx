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

type Term = {
    id: string;
    title: string;
    version: number;
    appliesToRoles?: string;
    purpose: string;
    revocable: boolean;
    requiresOptIn: boolean;
    acceptanceRequired?: boolean;
    validFrom?: string;
    validUntil?: string;
    content: string;
    customFields?: TermField[];
};

type TermField = {
    id: string;
    name: string;
    value: string;
    type: string;
};

export default function CreateUserPage() {
    const [form] = Form.useForm();
    const [terms, setTerms] = useState<Term[]>([]);
    const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
    const [acceptedIds, setAcceptedIds] = useState<string[]>([]);
    const [acceptedFieldMap, setAcceptedFieldMap] = useState<Record<string, string[]>>({});
    const [selectedRole, setSelectedRole] = useState<string>();
    const navigate = useNavigate();

    const fetchTerms = async () => {
        try {
            const { data } = await getTerms();
            setTerms(data.terms);
        } catch {
            SweetAlert.error('Erro', 'Erro ao carregar termos de consentimento');
        }
    };

    useEffect(() => {
        fetchTerms();
    }, []);

    const handleToggleCustomField = (termId: string, fieldId: string, isAccepted: boolean) => {
        setAcceptedFieldMap(prev => {
            const fields = prev[termId] || [];
            const updated = isAccepted ? fields.filter(id => id !== fieldId) : [...fields, fieldId];
            return { ...prev, [termId]: updated };
        });
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
            const acceptedFieldIds = Object.values(acceptedFieldMap).flat();

            const payload = {
                ...values,
                acceptedTermIds: acceptedIds,
                acceptedFieldIds: acceptedFieldIds.length ? acceptedFieldIds : undefined,
            };

            console.log('Payload enviado:', JSON.stringify(payload, null, 2));

            await createUser(payload);

            await SweetAlert.success('Sucesso', 'Usuário criado com sucesso!');
            form.resetFields();
            setAcceptedIds([]);
            setAcceptedFieldMap({});
        } catch (error: any) {
            const apiError = error?.response?.data;
            const errorMessages = Array.isArray(apiError?.message)
                ? apiError.message.join('<br/>')
                : apiError?.message || 'Erro ao criar usuário';

            SweetAlert.error('Erro', errorMessages);
        }
    };

    return (
        <div style={{ background: 'linear-gradient(to right, #e0eafc, #cfdef3)', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Card title="Cadastrar Novo Usuário" style={{ width: 1000, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: 12, border: '1px solid #d0d0d0', background: '#ffffffee' }}>
                <Form form={form} onFinish={onSubmit} layout="vertical">
                    <Row gutter={16}>
                        <Col span={8}><Form.Item label="Nome" name="name" rules={[{ required: true }]}><Input placeholder="Digite um nome" /></Form.Item></Col>
                        <Col span={8}><Form.Item label="E-mail" name="email" rules={[{ required: true }, { type: 'email' }]}><Input /></Form.Item></Col>
                        <Col span={8}><Form.Item label="Senha" name="password" rules={[{ required: true }]}><Input.Password /></Form.Item></Col>
                        <Col span={8}><Form.Item label="Função" name="role" rules={[{ required: true }]}><Select onChange={setSelectedRole}><Option value="ADMIN">Administrador</Option><Option value="EMPLOYEE">Funcionário</Option></Select></Form.Item></Col>
                        <Col span={8}><Form.Item label="CPF" name="cpf"><Input maxLength={14} placeholder="000.000.000-00" /></Form.Item></Col>
                        <Col span={8}><Form.Item label="Data de nascimento" name="birthDate"><Input type="date" /></Form.Item></Col>
                        <Col span={8}><Form.Item label="Telefone" name="phoneNumber"><Input maxLength={15} placeholder="(00) 00000-0000" /></Form.Item></Col>
                        <Col span={8}><Form.Item label="Cidade" name="city"><Input /></Form.Item></Col>
                        <Col span={8}><Form.Item label="Estado" name="state"><Input maxLength={2} /></Form.Item></Col>
                    </Row>

                    <Form.Item label="Termos de consentimento:" name="acceptedTermIds" initialValue={[]}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 200, overflowY: 'auto' }}>
                            {!selectedRole ? (
                                <i style={{ color: '#999' }}>Selecione uma função para visualizar os termos.</i>
                            ) : (
                                terms
                                    .filter(term => !term.appliesToRoles || term.appliesToRoles === selectedRole)
                                    .map(term => {
                                        const alreadyAccepted = acceptedIds.includes(term.id);
                                        return (
                                            <div key={term.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <strong>{term.title} (v.{term.version})</strong>
                                                {alreadyAccepted ? (
                                                    <span style={{ color: 'green', fontWeight: 'bold' }}>Aceito</span>
                                                ) : (
                                                    <Button type="link" onClick={() => setSelectedTerm(term)}>Visualizar</Button>
                                                )}
                                            </div>
                                        );
                                    })
                            )}
                        </div>
                    </Form.Item>

                    <Form.Item><Button htmlType="submit" type="primary" style={{ background: '#001529' }}>Salvar</Button></Form.Item>
                    <div style={{ textAlign: 'center' }}><Text>Já possui uma conta? </Text><Link onClick={() => navigate('/login')}>Clique aqui para fazer login</Link></div>
                </Form>
            </Card>

            <Modal
                open={!!selectedTerm}
                onCancel={() => setSelectedTerm(null)}
                title={selectedTerm?.title}
                footer={<Button onClick={() => setSelectedTerm(null)}>Fechar</Button>}
                width={700}
            >
                {selectedTerm && (
                    <>
                        <p><strong>Finalidade:</strong> {selectedTerm.purpose}</p>
                        <p><strong>Revogável:</strong> {selectedTerm.revocable ? 'Sim' : 'Não'}</p>
                        <p><strong>Requer opt-in:</strong> {selectedTerm.requiresOptIn ? 'Sim' : 'Não'}</p>
                        <p><strong>Aceite obrigatório:</strong> {selectedTerm.acceptanceRequired ? 'Sim' : 'Não'}</p>
                        <p><strong>Válido de:</strong> {selectedTerm.validFrom ? new Date(selectedTerm.validFrom).toLocaleDateString('pt-BR') : '-'}</p>
                        <p><strong>Válido até:</strong> {selectedTerm.validUntil ? new Date(selectedTerm.validUntil).toLocaleDateString('pt-BR') : '-'}</p>

                        <div style={{ borderTop: '1px solid #ccc', paddingTop: 12 }}>
                            <p><strong>Conteúdo:</strong></p>
                            <p>{selectedTerm.content}</p>
                        </div>

                        {(selectedTerm.customFields?.length ?? 0) > 0 && (
                            <div style={{ borderTop: '1px solid #ccc', paddingTop: 12 }}>
                                <p><strong>Campos opcionais:</strong></p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {selectedTerm.customFields?.map(field => {
                                        const termId = selectedTerm.id;
                                        const isAccepted = (acceptedFieldMap[termId] || []).includes(field.id);
                                        return (
                                            <div key={field.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <div>{field.name}: {field.value} ({field.type})</div>
                                                <Button
                                                    size="small"
                                                    type={isAccepted ? 'default' : 'primary'}
                                                    danger={isAccepted}
                                                    onClick={() => handleToggleCustomField(termId, field.id, isAccepted)}
                                                >
                                                    {isAccepted ? 'Revogar' : 'Aceitar'}
                                                </Button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <div style={{ marginTop: 24 }}>
                            <Button type="primary" onClick={() => handleAcceptTerm(selectedTerm.id)} block>
                                Aceitar Termo e Fechar
                            </Button>
                        </div>
                    </>
                )}
            </Modal>
        </div>
    );
}
