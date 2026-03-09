import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Flex, Form, Image, Input, message } from "antd";
import api from "../service";
import hotelImage from "../assets/hotel-login2.jpg";
import { useTheme } from "../context/useTheme";
import { NavLink } from "react-router-dom";

export default function RegisterUser() {

    const [form] = Form.useForm();
    const { colors } = useTheme();

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (values) => api.post('/api/auth/register/', values),

        onSuccess: () => {
            message.success('Usuário cadastrado com sucesso!');
            queryClient.invalidateQueries(['users']); // Atualiza a table de hóspedes
            form.resetFields();
        },
        onError: () => {
            message.error('Erro ao cadastrar usuário');
        }
    })

    const onFinish = (values) => {
        mutation.mutate(values);
    }

    return (
        <Flex>
            <Flex style={{
                background: colors.background,
                alignItems: "center",
                justifyContent: "center",
                width: "90%",
                height: "100vh"
            }}>
                <Card style={{ width: 400, background: colors.cardBackground }}>
                    <Form
                        layout="vertical"
                        form={form}
                        onFinish={onFinish}
                    >
                        <Form.Item label="Nome de usuário" name="username" rules={[{ required: true, message: "Informe o nome" }]}>
                            <Input style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item label="E-mail" name="email" rules={[{ required: true, message: "Informe o e-mail" }]}>
                            <Input style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item label="Senha" name="password" rules={[{ required: true, message: "Informe a senha" }]}>
                            <Input.Password style={{ width: '100%' }} visibilityToggle />
                        </Form.Item>

                        <Flex justify="end">
                            <Button htmlType="submit" type="primary">
                                Cadastrar
                            </Button>

                            <NavLink to="/auth/login">
                                <Button type="primary" danger style={{ marginLeft: 8 }}>
                                    Voltar
                                </Button>
                            </NavLink>
                        </Flex>
                    </Form>
                </Card>
            </Flex>
            <Image
                src={hotelImage}
                preview={false}
                style={{ width: "100%", height: "100vh", objectFit: "cover" }}
            />
        </Flex>
    )
}