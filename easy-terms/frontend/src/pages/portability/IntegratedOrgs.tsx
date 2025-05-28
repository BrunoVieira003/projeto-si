import { useEffect, useState } from "react";
import { deleteIntegration, getIntegrations, getOrgs } from "../../services/integrationsService";
import { Button, Flex, Popconfirm, Table, Typography } from "antd";
import { SweetAlert } from "../../components/SweetAlert/SweetAlert";
import EditableStatus from "../../components/StatusEditable";

export default function IntegratedOrgs(){
    const [integrations, setIntegrations] = useState<any[]>([])
    const columns = [
        {
          title: 'Organização',
          dataIndex: 'name',
          key: 'name'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render(value: string){
                return <EditableStatus data={value} onDataChange={e => console.log(e)}/>
            }
        },
        {
            title: 'E-mail',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: 'Website',
            dataIndex: 'website',
            key: 'website'
        },
    ]

    const fetchOrgs = async () => {
        try{
            const data = await getOrgs()
            console.log(data)
            setIntegrations(data)
        }catch(e){
            console.error(e)
            throw e
        }
    }

    useEffect(() => {
        fetchOrgs()
    }, [])

    return (
        <Flex vertical>
            <Typography.Title>Organizações</Typography.Title>
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