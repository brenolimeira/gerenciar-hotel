import { useState } from 'react';
import {  Layout, theme } from 'antd';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './routes';
import SideBar from './components/SideBar';
import SideHeader from './components/SideHeader';
import { useTheme } from './context/useTheme';

const { Content } = Layout;

const App = () => {

  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const { colors } = useTheme();

  const token = localStorage.getItem("token");

  return (
    <Router>
      {token ? (
        <Layout style={{ background: colors.background, minHeight: '100vh' }}>
          <SideBar collapsed={collapsed} setCollapsed={setCollapsed} />
          <Layout style={{ background: colors.background, display: "flex", flexDirection: "column" }}>
            <SideHeader
              collapsed={collapsed}
              setCollapsed={setCollapsed}
            />
            <Content
              style={{
                // margin: '24px 16px',
                marginTop: "16px",
                padding: 24,
                background: colors.contentBackground,
                borderRadius: borderRadiusLG,
                flex: 1,
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
                width: "100%",
              }}
            >
              <div style={{ minHeight: 0, display: "flex" }}>
                <Routes />
              </div>
            </Content>
          </Layout>
        </Layout>
      ) : (
        <Routes />
      )}

    </Router>
  );
};
export default App;