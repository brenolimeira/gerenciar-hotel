import { Menu, Layout } from 'antd';

import {
    SettingOutlined,
    TabletOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import { useTheme } from '../context/useTheme';
import { NavLink } from 'react-router-dom';


const { Sider } = Layout;

function SideBar({ collapsed }) {

    const { colors, theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{
                    background: colors.sider,
                }}
            >   
                <div className="demo-logo-vertical" />
                <Menu
                    theme={isDark ? 'dark' : 'light'}
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    style={{
                        marginTop: '50px',
                        background: colors.sider,
                        color: colors.text,
                    }}
                    items={[
                        {
                            key: 'home',
                            icon: <TabletOutlined style={{ color: colors.text }} />,
                            label: (
                                <NavLink to="/" style={{ color: colors.text }}>
                                    Hospedagem
                                </NavLink>
                            )
                        },
                        {
                            key: 'rooms',
                            icon: <SettingOutlined style={{ color: colors.text }} />,
                            label: (
                                <NavLink to="/room/edit" style={{ color: colors.text }}>
                                    Gerenciar Quartos
                                </NavLink>
                            ),
                        },
                        {
                            key: 'guests',
                            icon: <TeamOutlined  style={{ color: colors.text }} />,
                            label: (
                                <NavLink to="/guests" style={{ color: colors.text }}>
                                    Hóspedes
                                </NavLink>
                            ),
                        },

                    ]}
                />
            </Sider>
        </>
    );
}

export default SideBar;