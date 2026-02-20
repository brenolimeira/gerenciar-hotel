import { Menu, Layout } from 'antd';

import {
    SettingOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import { useTheme } from '../context/useTheme';
import { NavLink } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faHotel } from '@fortawesome/free-solid-svg-icons';


const { Sider } = Layout;

function SideBar({ collapsed, setCollapsed }) {

    const location = useLocation();

    const { colors, theme } = useTheme();
    const isDark = theme === "dark";

    return (
        <>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                breakpoint="lg"
                collapsedWidth={80}
                onBreakpoint={(broken) => setCollapsed(broken)}
                style={{ background: colors.sider }}
            >
                <div className="demo-logo-vertical" />
                <Menu
                    theme={isDark ? 'dark' : 'light'}
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    style={{
                        marginTop: '50px',
                        background: colors.sider,
                        color: colors.text,
                    }}
                    items={[
                        {
                            key: '/',
                            icon: <FontAwesomeIcon icon={faHotel} />,
                            label: (
                                <NavLink to="/" style={{ color: colors.text }}>
                                    Hospedagem
                                </NavLink>
                            )
                        },
                        {
                            key: '/guests',
                            icon: <TeamOutlined style={{ color: colors.text }} />,
                            label: (
                                <NavLink to="/guests" style={{ color: colors.text }}>
                                    Hóspedes
                                </NavLink>
                            ),
                        },
                        {
                            key: '/booking/historic',
                            icon: <FontAwesomeIcon icon={faClipboardList} />,
                            label: (
                                <NavLink to="/booking/historic" style={{ color: colors.text }}>
                                    Histórico
                                </NavLink>
                            ),
                        },
                        {
                            key: '/room/edit',
                            icon: <SettingOutlined style={{ color: colors.text }} />,
                            label: (
                                <NavLink to="/room/edit" style={{ color: colors.text }}>
                                    Gerenciar Quartos
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