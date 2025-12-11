import { Menu, Layout } from 'antd';

import {
    SettingOutlined,
    TabletOutlined,
} from '@ant-design/icons';
import { useTheme } from '../context/useTheme';
import { NavLink } from 'react-router-dom';

const { Sider } = Layout;

function SideBar({ collapsed }) {

    const { colors, theme } = useTheme();

    const isDark = theme === "dark";

    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            style={{
                height: '100vh',
                overflow: 'auto',
                background: colors.sider,
            }}
        >
            <div className="demo-logo-vertical" />
            <Menu
                theme={isDark ? 'dark' : 'light'}
                mode="inline"
                defaultSelectedKeys={['1']}
                style={{ marginTop: '50px', 
                        background: colors.sider,
                        color: colors.text,
                     }}
                items={[
                    {
                        key: '1',
                        icon: <TabletOutlined style={{ color: colors.text }} />,
                        label: (
                            <NavLink to="/" style={{ color: colors.text }}>
                                Hospedagem
                            </NavLink>
                        )
                    },
                    {
                        key: '2',
                        icon: <SettingOutlined style={{ color: colors.text }} />,
                        label: 'Gerenciar Quartos',
                    },
                    
                ]}
            />
        </Sider>
    );
}

export default SideBar;