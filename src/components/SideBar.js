import { Grid, Layout, Drawer, Menu } from 'antd';
import { useTheme } from '../context/useTheme';
import {
    SettingOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import { NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faHotel } from '@fortawesome/free-solid-svg-icons';

const { Header, Sider } = Layout;
const { useBreakpoint } = Grid;

function SideBar({ collapsed, setCollapsed }) {

    const location = useLocation();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const { colors, theme } = useTheme();
    const isDark = theme === "dark";

    const items = [
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
    ];

    return (
        <>
            {!isMobile && (
                <Header style={{ padding: 0, background: colors.contentBackground }}>
                    <Sider
                        trigger={null}
                        collapsible
                        collapsed={collapsed}
                        breakpoint="lg"
                        collapsedWidth={80}
                        onBreakpoint={(broken) => setCollapsed(broken)}
                        style={{ background: colors.sider, height: "100vh" }}
                    >
                        <Menu
                            theme={isDark ? 'dark' : 'light'}
                            mode="inline"
                            selectedKeys={[location.pathname]}
                            style={{
                                marginTop: '50px',
                                background: colors.sider,
                                color: colors.text,
                            }}
                            items={items}
                        />
                    </Sider>
                </Header>
            )}

            {isMobile && (
                <Drawer
                    title="Menu"
                    placement="left"
                    onClose={() => setCollapsed(false)}
                    open={collapsed}
                    bodyStyle={{
                        padding: 0,
                        background: colors.sider,
                    }}
                >
                    <Menu
                        theme={isDark ? 'dark' : 'light'}
                        mode="inline"
                        selectedKeys={[location.pathname]}
                        style={{
                            background: colors.sider,
                            color: colors.text,
                        }}
                        items={items}
                        onClick={() => setCollapsed(false)}
                    />
                </Drawer>
            )}

        </>
    );
}

export default SideBar;