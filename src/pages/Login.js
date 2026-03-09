import { useMutation } from "@tanstack/react-query";
import { Form, Button, Input, message, Flex, Card, Image, Grid } from "antd";
import api from "../service";
import { useTheme } from "../context/useTheme";
import { Link } from "react-router-dom";
import hotelImage from "../assets/hotel-login2.jpg";

const { useBreakpoint } = Grid;

export default function Login() {
    const [form] = Form.useForm();

    const { colors } = useTheme();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const mutation = useMutation({
        mutationFn: (values) => api.post('/api/auth/login/', values),

        onSuccess: (response) => {
            const token = response.data.access;
            localStorage.setItem("token", token)

            message.success("Login realizado com sucesso!")
            form.resetFields();
            window.location.href = "/";
        },
        onError: (error) => {
            const errorMessage = error.response?.data?.error || "Erro ao logar";
            message.error(errorMessage);
        }
    })

    const onFinish = (values) => {
        mutation.mutate(values);
    }

    return (
        !isMobile ? (
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
                            <Form.Item label="Login" name="username" rules={[{ required: true, message: "Informe o nome" }]}>
                                <Input style={{ width: '100%' }} />
                            </Form.Item>
                            <Form.Item label="Senha" name="password" rules={[{ required: true, message: "Informe a senha" }]}>
                                <Input.Password style={{ width: '100%' }} visibilityToggle />
                            </Form.Item>
                            <Flex vertical>
                                <Link to="/auth/register">Deseja se cadastrar?</Link>
                                <Link to="">Esqueci minha senha</Link>
                            </Flex>

                            <Flex justify="end">
                                <Button htmlType="submit" type="primary">
                                    Entrar
                                </Button>

                                <Button type="primary" danger onClick={() => form.resetFields()} style={{ marginLeft: 8 }}>
                                    Resetar
                                </Button>
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
        ) : (
            <Flex style={{
                background: colors.background,
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100vh"
            }}>
                <Card style={{ width: 400, background: colors.cardBackground }}>
                    <Form
                        layout="vertical"
                        form={form}
                        onFinish={onFinish}
                    >
                        <Form.Item label="Login" name="username" rules={[{ required: true, message: "Informe o nome" }]}>
                            <Input style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item label="Senha" name="password" rules={[{ required: true, message: "Informe a senha" }]}>
                            <Input.Password style={{ width: '100%' }} visibilityToggle />
                        </Form.Item>
                        <Flex vertical>
                            <Link to="/auth/register">Deseja se cadastrar?</Link>
                            <Link to="">Esqueci minha senha</Link>
                        </Flex>

                        <Flex justify="end">
                            <Button htmlType="submit" type="primary">
                                Entrar
                            </Button>

                            <Button type="primary" danger onClick={() => form.resetFields()} style={{ marginLeft: 8 }}>
                                Resetar
                            </Button>
                        </Flex>
                    </Form>
                </Card>
            </Flex>
        )
    )
}