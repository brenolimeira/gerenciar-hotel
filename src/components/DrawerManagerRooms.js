import { Drawer, Form, Button, Input, InputNumber, Checkbox, ConfigProvider, message, Flex } from 'antd'
import api from '../service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useButtonStyles } from "../styles/useButtonStyles";
import { useTheme } from '../context/useTheme';

export default function DrawerManagerRooms({ drawerOpen, drawerType, closeDrawer, forms, selectedRoom, setSelectedRoom }) {

    const { styles } = useButtonStyles();
    const [form] = Form.useForm();

    const { colors, theme } = useTheme();

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (values) =>
            api.post('/api/rooms/', values),

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
            api.patch(`/api/rooms/${selectedRoom.id}/`, values),

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
        closeDrawer();
    };

    const onFinish = (values) => {
        mutation.mutate(values);
    };

    return (
        <Drawer
            title={
                (drawerType === 'create' && 'Cadastrar Quarto') ||
                (drawerType === 'edit' && 'Editar Quartos')
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
                    <Form.Item label="Nome" name="name" rules={[{ required: true }]}>
                        <Input style={{ width: '100%' }} />
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
                    <Form.Item
                        name="air_conditioning"
                        valuePropName="checked"
                    >
                        <Checkbox>Ar Condicionado</Checkbox>
                    </Form.Item>
                    <Form.Item
                        name="fan"
                        valuePropName="checked"
                    >
                        <Checkbox>Ventilador</Checkbox>
                    </Form.Item>
                    <Form.Item
                        name="crib"
                        valuePropName="checked"
                    >
                        <Checkbox>Berço</Checkbox>
                    </Form.Item>
                    <Flex gap={8}>
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
                        <Button
                            type="primary"
                            danger
                            size="large"
                            onClick={() => form.resetFields()}
                        >
                            Resetar
                        </Button>
                    </Flex>
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
                    <Flex gap={8}>
                        <Button htmlType="submit" type="primary">
                            Salvar
                        </Button>

                        <Button onClick={handleBack} style={{ marginLeft: 8 }}>
                            Voltar
                        </Button>
                    </Flex>
                </Form>
            )}
        </Drawer>
    )
}