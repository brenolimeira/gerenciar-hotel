import { Button, Flex, Grid } from 'antd';
import ThemeSwitcher from './ThemeSwitcher';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    LogoutOutlined
} from '@ant-design/icons';

const { useBreakpoint } = Grid;

function SideHeader({ collapsed, setCollapsed }) {

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
    }

    const screens = useBreakpoint();
    const isMobile = !screens.md;

    return (
        <Flex align="center" justify="space-between" style={{ width: '100%' }}>
            <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                }}
            />
            <Flex align="center" gap={10}>
                <ThemeSwitcher />
                {isMobile ? (
                    <Button
                    danger
                    icon={<LogoutOutlined />}
                    style={{ marginRight: 4 }}
                    onClick={handleLogout}
                >
                </Button>
                ) : (
                    <Button
                        danger
                        icon={<LogoutOutlined />}
                        style={{ marginRight: 4 }}
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                )}
            </Flex>
        </Flex>
    );
}

export default SideHeader;