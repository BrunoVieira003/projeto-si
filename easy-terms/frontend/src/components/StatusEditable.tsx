import React, { useState, useEffect } from 'react';
import { Table, Select, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;

export interface DataType {
  key: string;
  name: string;
  status: 'pending' | 'approved' | 'denied';
}

interface EditableTableProps {
  data: string;
  onDataChange: (newData: string) => void;
}

const EditableStatus: React.FC<EditableTableProps> = ({ data, onDataChange }) => {
  const [editingKey, setEditingKey] = useState<string>('');
  const [localData, setLocalData] = useState<string>(data);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const isEditing = (record: DataType) => record.key === editingKey;

  const edit = (record: DataType) => {
    setEditingKey(record.key);
  };

  const save = (key: string) => {
    setEditingKey('');
    onDataChange(localData);
  };

  const cancel = () => {
    setLocalData(data); // rollback changes
    setEditingKey('');
  };

  const handleStatusChange = (value: DataType['status'], key: string) => {
    const newData = localData.map(item => 
      item.key === key ? { ...item, status: value } : item
    );
    setLocalData(newData);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (_: any, record: DataType) => {
        const editable = isEditing(record);
        return editable ? (
          <Select
            value={record.status}
            onChange={(value) => handleStatusChange(value, record.key)}
            style={{ width: 120 }}
          >
            <Option value="pending">Pending</Option>
            <Option value="approved">Approved</Option>
            <Option value="denied">Denied</Option>
          </Select>
        ) : (
          record.status.charAt(0).toUpperCase() + record.status.slice(1)
        );
      },
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (_: any, record: DataType) => {
        const editable = isEditing(record);
        return editable ? (
          <>
            <Button type="link" onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              Save
            </Button>
            <Button type="link" onClick={cancel}>
              Cancel
            </Button>
          </>
        ) : (
          <Button type="link" disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Button>
        );
      },
    },
  ];

  return <Table columns={columns} dataSource={localData} pagination={false} rowKey="key" />;
};

export default EditableStatus;