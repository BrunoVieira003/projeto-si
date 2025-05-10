import { Layout, Menu, Avatar, Tooltip } from 'antd';
import {
  FileTextOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const { Sider, Content, Header } = Layout;

export default function NavbarLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout();
    } else {
      navigate(key);
    }
  };

  const roleLabels: Record<string, string> = {
    ADMIN: 'ADMINISTRADOR',
    EMPLOYEE: 'FUNCIONÁRIO',
  };

  const menuItems = [
    { key: '/terms', icon: <FileTextOutlined />, label: 'Termos', roles: ['ADMIN'] },
    { key: '/users', icon: <UserOutlined />, label: 'Usuários', roles: ['ADMIN', 'EMPLOYEE'] },
    { key: '/termsAcceptance', icon: <FileTextOutlined />, label: 'Termos Aceitos', roles: ['ADMIN', 'EMPLOYEE'] },
    { key: '/history', icon: <FileTextOutlined />, label: 'Histórico', roles: ['ADMIN'] },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Sair', roles: ['ADMIN', 'EMPLOYEE'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(user?.role ?? ''));

  const formattedName = user?.name?.split(' ')[0] ?? 'Usuário';
  
  const formattedRole = user?.role
  ? roleLabels[user.role] ?? user.role
  : 'Guest';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} width={200} theme="dark">
        <div style={{ margin: '16px', textAlign: 'center' }}>
          {collapsed ? (
            <Tooltip title={`Olá, ${formattedName} (${formattedRole})`}>
              <Avatar style={{ backgroundColor: '#1890ff' }}>
                {formattedName.charAt(0).toUpperCase()}
              </Avatar>
            </Tooltip>
          ) : (
            <div
              style={{
                background: '#1890ff',
                borderRadius: '8px',
                padding: '16px',
                color: '#fff',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ fontSize: '16px' }}>
                Olá, <strong>{formattedName}</strong>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 500, opacity: 0.9, marginTop: 4 }}>
                {formattedRole}
              </div>
            </div>
          )}
        </div>

        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[location.pathname]}
          onClick={handleClick}
          items={filteredItems}
        />
      </Sider>

      <Layout>
        <Header style={{ background: '#fff', padding: '0 16px', textAlign: 'right' }}>
          <span
            style={{ fontSize: 20, cursor: 'pointer' }}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </span>
        </Header>

        <Content style={{ padding: '24px' }}>{children}</Content>
      </Layout>
    </Layout>
  );
}
