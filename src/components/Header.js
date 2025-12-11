import { Button, Flex, Layout } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import ThemeSwitcher from './ThemeSwitcher';
import { useTheme } from '../context/useTheme';

const { Header } = Layout;

function SideHeader({ collapsed, setCollapsed }) {

    const { colors } = useTheme();

    return (
        <Header style={{ padding: 0, background: colors.contentBackground }}>
            <Flex align='center' justify='space-between'>
                <>
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
                    <ThemeSwitcher />
                </>
            </Flex>
        </Header>
    );
}

export default SideHeader;