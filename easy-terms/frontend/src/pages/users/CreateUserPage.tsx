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
                        <Col span={8}><Form.Item label="Nome" name="name" rules={[{ required: true }]}><Input placeholder="Digite o nome completo" /></Form.Item></Col>
                        <Col span={8}><Form.Item label="E-mail" name="email" rules={[{ required: true }, { type: 'email' }]}><Input placeholder="Digite o e-mail do usuário" /></Form.Item></Col>
                        <Col span={8}><Form.Item label="Senha" name="password" rules={[{ required: true }]}><Input.Password placeholder="Digite uma senha segura" /></Form.Item></Col>
                        <Col span={8}><Form.Item label="Função" name="role" rules={[{ required: true }]}><Select placeholder="Selecione a função"><Option value="ADMIN">Administrador</Option><Option value="EMPLOYEE">Funcionário</Option></Select></Form.Item></Col>
                        <Col span={8}><Form.Item label="CPF (opcional)" name="cpf"><Input maxLength={14} placeholder="000.000.000-00" /></Form.Item></Col>
                        <Col span={8}><Form.Item label="Data de nascimento (opcional)" name="birthDate"><Input type="date" placeholder="dd/mm/aaaa" /></Form.Item></Col>
                        <Col span={8}><Form.Item label="Telefone (opcional)" name="phoneNumber"><Input maxLength={15} placeholder="(00) 00000-0000" /></Form.Item></Col>
                        <Col span={8}><Form.Item label="Cidade (opcional)" name="city"><Input placeholder="Digite a cidade" /></Form.Item></Col>
                        <Col span={8}><Form.Item label="Estado (opcional)" name="state"><Input maxLength={2} placeholder="UF" /></Form.Item></Col>
                    </Row>

                    <Form.Item label="Termos de consentimento:" name="acceptedTermIds" initialValue={[]}> 
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 200, overflowY: 'auto' }}>
                            {terms.map(term => {
                                const alreadyAccepted = acceptedIds.includes(term.id);
                                return (
                                    <div key={term.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <strong>{term.title} (v.{term.version})</strong>
                                        {alreadyAccepted ? (
                                            <span style={{ color: 'green', fontWeight: 'bold', paddingRight: 15 }}>Aceito</span>
                                        ) : (
                                            <Button type="link" onClick={() => setSelectedTerm(term)}>Visualizar</Button>
                                        )}
                                    </div>
                                );
                            })}
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
                width={800}
            >
                {selectedTerm && (
                    <>
                        <div style={{ borderTop: '1px solid #ccc', paddingTop: 12 }}>
                            <p><strong>Conteúdo:</strong></p>
                            <p>{selectedTerm.content}</p>
                        </div>

                        {(selectedTerm.customFields?.length ?? 0) > 0 && (
                            <div style={{ borderTop: '1px solid #ccc', paddingTop: 12 }}>
                                <p><strong>Campos opcionais:</strong></p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginRight: '5px', marginLeft: '5px' }}>
                                    {selectedTerm.customFields?.map(field => {
                                        const termId = selectedTerm.id;
                                        const isAccepted = (acceptedFieldMap[termId] || []).includes(field.id);
                                        return (
                                            <div key={field.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <div> - <strong>{field.name}</strong>: {field.value}</div>
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
