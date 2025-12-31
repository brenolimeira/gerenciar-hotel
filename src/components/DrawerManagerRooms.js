import { Drawer, Form, Row, Col, Button, Input, InputNumber, Checkbox, ConfigProvider, message } from 'antd'
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createStyles } from 'antd-style';

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

export default function DrawerManagerRooms({ drawerOpen, drawerType, closeDrawer, forms, selectedRoom, setSelectedRoom }) {

    const { styles } = useStyle();
    const [form] = Form.useForm();

    const queryClient = useQueryClient();

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

    const updateMutation = useMutation({
        mutationFn: (values) =>
            axios.patch(`http://127.0.0.1:8000/api/rooms/${selectedRoom.id}/`, values),

        onSuccess: () => {
            message.success("Quarto atualizado!");
            queryClient.invalidateQueries(["rooms"]);
            setSelectedRoom(null);
            closeDrawer();
            forms.resetFields();
        },
        onError: () => {
            message.error('Erro ao editar quarto');
        }
    });

    const handleBack = () => {
        setSelectedRoom(null);
        forms.resetFields();
    };

    const onFinish = (values) => {
        mutation.mutate(values);
    };

    return (
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
                    layout="vertical"
                    style={{ maxWidth: 600 }}
                    form={form}
                    onFinish={onFinish}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Nome" name="name" rules={[{ required: true }]}>
                                <Input style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Quantidade de Hóspedes" name="guest_capacity" rules={[{ required: true }]}>
                                <InputNumber />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Camas de Casal" name="double_beds" rules={[{ required: true }]}>
                                <InputNumber />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Camas de Solteiro" name="single_beds" rules={[{ required: true }]}>
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
            {drawerType === "edit" && selectedRoom && (
                <Form
                    layout="vertical"
                    form={forms}
                    onFinish={updateMutation.mutate}
                >
                    <Form.Item label="Nome" name="name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Quantidade de Hóspedes" name="guest_capacity" rules={[{ required: true }]}>
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item label="Camas de Casal" name="double_beds" rules={[{ required: true }]}>
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item label="Camas de Solteiro" name="single_beds" rules={[{ required: true }]}>
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item name="air_conditioning" valuePropName="checked">
                        <Checkbox>Ar Condicionado</Checkbox>
                    </Form.Item>
                    <Form.Item name="fan" valuePropName="checked">
                        <Checkbox>Ventilador</Checkbox>
                    </Form.Item>
                    <Form.Item name="crib" valuePropName="checked">
                        <Checkbox>Berço</Checkbox>
                    </Form.Item>

                    <Button htmlType="submit" type="primary">
                        Salvar
                    </Button>

                    <Button onClick={handleBack} style={{ marginLeft: 8 }}>
                        Voltar
                    </Button>
                </Form>
            )}
        </Drawer>
    )
}