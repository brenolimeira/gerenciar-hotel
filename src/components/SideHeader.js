import { Button, Flex } from 'antd';
import ThemeSwitcher from './ThemeSwitcher';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';

function SideHeader({ collapsed, setCollapsed }) {

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
            <ThemeSwitcher />
        </Flex>
    );
}

export default SideHeader;