import { Menu, Layout, Drawer, Form, Row, Col, Button, Input, InputNumber, Checkbox, ConfigProvider, message } from 'antd';

import {
    SettingOutlined,
    TabletOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { useTheme } from '../context/useTheme';
import { NavLink } from 'react-router-dom';
import { createStyles } from 'antd-style';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useStyle = createStyles(({ prefixCls, css }) => ({
    linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
      > span {
        position: relative;
      }

      &::before {
        content: '';
        background: linear-gradient(135deg, #191E26, #3E4C59);
        position: absolute;
        inset: -1px;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `,
}));

const { Sider } = Layout;

function SideBar({ collapsed }) {

    const { colors, theme } = useTheme();
    const isDark = theme === "dark";
    const { styles } = useStyle();
    const [form] = Form.useForm();

    const queryClient = useQueryClient();

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

    const mutation = useMutation({
        mutationFn: (values) =>
            axios.post('http://127.0.0.1:8000/api/rooms/', values),

        onSuccess: () => {
            message.success('Quarto cadastrado com sucesso!');
            queryClient.invalidateQueries(['rooms']); // Atualiza o Home
            form.resetFields();
            closeDrawer(); // Fecha o Drawer
        },
        onError: () => {
            message.error('Erro ao cadastrar quarto');
        }
    });

    const onFinish = (values) => {
        mutation.mutate(values);
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
                        if (key === 'edit') openDrawer('edit');
                        if (key === 'remove') openDrawer('remove');
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
                                { key: 'edit', label: 'Editar' },
                                { key: 'remove', label: 'Remover' },
                            ]
                        },

                    ]}
                />
            </Sider>
            <Drawer
                title={
                    (drawerType === 'create' && 'Cadastrar Quarto') ||
                    (drawerType === 'edit' && 'Editar Quartos') ||
                    (drawerType === 'remove' && 'Remover Quartos')
                }
                placement="right"
                size={480}
                onClose={closeDrawer}
                open={drawerOpen}
            >
                {
                    drawerType === 'create' && <Form
                        layout="horizontal"
                        style={{ maxWidth: 600 }}
                        form={form}
                        onFinish={onFinish}
                    >
                        <Row gutter={16}>
                            <Form.Item label="Nome" name="name" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Quantidade de Hóspedes" name="guest_capacity">
                                    <InputNumber />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Camas de Casal" name="double_beds">
                                    <InputNumber />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Camas de Solteiro" name="single_beds">
                                    <InputNumber />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="air_conditioning"
                                    valuePropName="checked"
                                >
                                    <Checkbox>Ar Condicionado</Checkbox>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="fan"
                                    valuePropName="checked"
                                >
                                    <Checkbox>Ventilador</Checkbox>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="crib"
                                    valuePropName="checked"
                                >
                                    <Checkbox>Berço</Checkbox>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={6}>
                                <ConfigProvider
                                    button={{ className: styles.linearGradientButton }}
                                >
                                    <Button
                                        type="primary"
                                        size="large"
                                        htmlType="submit"
                                        loading={mutation.isLoading}
                                    >
                                        Cadastrar
                                    </Button>
                                </ConfigProvider>
                            </Col>
                            <Col span={6}>
                                <ConfigProvider
                                    button={{ className: styles.linearGradientButton }}
                                >
                                    <Button
                                        type="primary"
                                        size="large"
                                        onClick={() => form.resetFields()}
                                    >
                                        Resetar
                                    </Button>
                                </ConfigProvider>
                            </Col>
                        </Row>
                    </Form>
                }
                {drawerType === 'edit' && <p>Lista de quartos para edição</p>}
                {drawerType === 'remove' && <p>Confirmação de remoção</p>}
            </Drawer>
        </>
    );
}

export default SideBar;