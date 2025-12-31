import { Menu, Layout } from 'antd';

import {
    SettingOutlined,
    TabletOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { useTheme } from '../context/useTheme';
import { NavLink } from 'react-router-dom';
import DrawerManagerRooms from './DrawerManagerRooms';


const { Sider } = Layout;

function SideBar({ collapsed }) {

    const { colors, theme } = useTheme();
    const isDark = theme === "dark";

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerType, setDrawerType] = useState(null);

    const openDrawer = (type) => {
        setDrawerType(type);
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
        setDrawerType(null);
    };

    return (
        <>
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
                    style={{
                        marginTop: '50px',
                        background: colors.sider,
                        color: colors.text,
                    }}
                    onClick={({ key }) => {
                        if (key === 'create') openDrawer('create');
                        // if (key === 'edit') openDrawer('edit');
                        // if (key === 'remove') openDrawer('remove');
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
                            label: "Gerenciar Quartos",
                            children: [
                                { key: 'create', label: 'Cadastrar' },
                                {
                                    key: 'edit', label: (
                                        <NavLink to="/room/edit" style={{ color: colors.text }}>
                                            Editar/Remover
                                        </NavLink>
                                    )
                                },
                            ]
                        },

                    ]}
                />
            </Sider>
            <DrawerManagerRooms drawerOpen={drawerOpen} drawerType={drawerType} closeDrawer={closeDrawer} />
        </>
    );
}

export default SideBar;