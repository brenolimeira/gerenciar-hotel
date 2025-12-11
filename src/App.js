import React, { useState } from 'react';
import { Layout, theme } from 'antd';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './routes';
import SideBar from './components/SideBar';
import SideHeader from './components/Header';
import { useTheme } from './context/useTheme';

const { Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const { colors } = useTheme();

  return (
    <Router>
      <Layout style={{ background: colors.background }}>
        <SideBar collapsed={collapsed} />
        <Layout style={{ background: colors.background }}>
          <SideHeader
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              background: colors.contentBackground,
              borderRadius: borderRadiusLG,
            }}
          >
            <Routes />
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};
export default App;