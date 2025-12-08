import { BulbOutlined } from '@ant-design/icons';
import { useTheme } from '../context/useTheme';

const ThemeSwitcher= () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <BulbOutlined onClick={toggleTheme} style={{paddingRight: 16, fontSize: 16}} />
    );
}

export default ThemeSwitcher;