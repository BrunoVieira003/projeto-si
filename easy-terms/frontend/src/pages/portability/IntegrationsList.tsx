import { useEffect, useState } from "react";
import { deleteIntegration, getIntegrations } from "../../services/integrationsService";
import { Button, Flex, Popconfirm, Table, Typography } from "antd";
import { SweetAlert } from "../../components/SweetAlert/SweetAlert";



export default function IntegrationsList(){
    const [integrations, setIntegrations] = useState<any[]>([])
    const columns = [
        {
          title: 'Nome',
          dataIndex: 'name',
          key: 'name'
        },
        {
            title: 'Excluir',
            key: 'actions',
            render: (_: any, record: any) => (
            <Button danger style={{ display: 'flex', gap: 12 }}>
                <Popconfirm
                    title="Tem certeza que deseja excluir?"
                    okText="Sim"
                    cancelText="Não"
                    onConfirm={() => handleDelete(record.id)}
                >
                    Excluir
                </Popconfirm>
            </Button>
            )
        }
    ]
    
    
    const handleDelete = async (id: string) => {
        SweetAlert.loading();
        try {
          await deleteIntegration(id);
          SweetAlert.success('Sucesso', 'Integração removida');
          fetchIntegrations();
        } catch {
          SweetAlert.error('Erro', 'Erro ao remover usuário');
        }
    };

    const fetchIntegrations = async () => {
        try{
            const data = await getIntegrations()
            console.log(data)
            setIntegrations(data)
        }catch(e){
            console.error(e)
            throw e
        }
    }

    useEffect(() => {
        fetchIntegrations()
    }, [])

    return (
        <Flex vertical>
            <Typography.Title>Integrações</Typography.Title>
            <Table
              columns={columns}
              dataSource={integrations}
              rowKey="id"
              pagination={{ pageSize: 5 }}
              scroll={{ x: 'max-content' }}
            />
        </Flex>
    )
}