import { Drawer, Form, Button, Input, ConfigProvider, message, DatePicker } from 'antd'
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useButtonStyles } from "../styles/useButtonStyles";
import dayjs from 'dayjs';
import { useEffect } from 'react';

export default function DrawerManagerGuests({ drawerOpen, drawerType, closeDrawer, forms, selectedGuest, setSelectedGuest }) {
    const { styles } = useButtonStyles();
    const [form] = Form.useForm();

    const queryClient = useQueryClient();

    useEffect(() => {
        if (selectedGuest) {

            forms.setFieldsValue({
                ...selectedGuest,
                cpf: selectedGuest.cpf?.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4"),
                phone: selectedGuest.phone?.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3"),
                birth_date: selectedGuest.birth_date
                    ? dayjs(selectedGuest.birth_date, "YYYY-MM-DD")
                    : null
            });
        }
    }, [selectedGuest, forms]);

    // Remove mascara do CPF
    const cleanCPF = (value) => value?.replace(/\D/g, "") || "";

    const mutation = useMutation({
        mutationFn: (values) =>
            axios.post('http://127.0.0.1:8000/api/guests/', values),

        onSuccess: () => {
            message.success('Hóspede cadastrado com sucesso!');
            queryClient.invalidateQueries(['guests']); // Atualiza a table de hóspedes
            form.resetFields();
            closeDrawer(); // Fecha o Drawer
        },
        onError: () => {
            message.error('Erro ao cadastrar hóspede');
        }
    });

    const updateMutation = useMutation({
        mutationFn: (values) =>
            axios.patch(`http://127.0.0.1:8000/api/guests/${selectedGuest.id}/`, values),

        onSuccess: () => {
            message.success("Hóspede atualizado!");
            queryClient.invalidateQueries(["guests"]);
            setSelectedGuest(null);
            closeDrawer();
            forms.resetFields();
        },
        onError: () => {
            message.error('Erro ao editar hóspede');
        }
    });

    const handleBack = () => {
        setSelectedGuest(null);
        forms.resetFields();
        closeDrawer();
    };

    const onFinish = (values) => {

        const payload = {
            ...values,
            cpf: cleanCPF(values.cpf),
            phone: cleanCPF(values.phone),
            birth_date: values.birth_date
                ? values.birth_date.format("YYYY-MM-DD")
                : null
        };

        mutation.mutate(payload);
    };

    const handleEditFinish = (values) => {
        const payload = {
            ...values,
            cpf: cleanCPF(values.cpf),
            phone: cleanCPF(values.phone),
            birth_date: values.birth_date
                ? values.birth_date.format("YYYY-MM-DD")
                : null
        };

        updateMutation.mutate(payload);
    };

    return (
        <Drawer
            title={
                (drawerType === 'create' && 'Cadastrar Hóspede') ||
                (drawerType === 'edit' && 'Editar Hóspede')
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
                    <Form.Item label="Nome" name="name" rules={[{ required: true, message: "Informe o nome" }]}>
                        <Input style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="CPF"
                        name="cpf"
                        rules={[{ required: true, message: "Informe o CPF" },
                        { pattern: /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, message: "CPF inválido" }]}
                    >
                        <Input
                            placeholder="000.000.000-00"
                            maxLength={14}
                            onChange={(e) => {
                                let v = e.target.value.replace(/\D/g, "");

                                v = v.replace(/(\d{3})(\d)/, "$1.$2");
                                v = v.replace(/(\d{3})(\d)/, "$1.$2");
                                v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

                                form.setFieldsValue({ cpf: v });
                            }}
                        />
                    </Form.Item>

                    <Form.Item label="RG" name="rg" rules={[{ required: true, message: "Informe o RG" }]}>
                        <Input style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="Data de Nascimento"
                        name="birth_date"
                        rules={[{ required: true, message: "Informe a data de nascimento" }]}
                    >
                        <DatePicker
                            format="DD/MM/YYYY"
                            style={{ width: "100%" }}
                            placeholder="Selecione a data"
                            disabledDate={(date) => date && date > dayjs()}
                        />
                    </Form.Item>
                    <Form.Item label="Telefone" name="phone" rules={[{ required: true }, { pattern: /^\(?\d{2}\)?\s?\d{5}-?\d{4}$/, message: "Telefone inválido" }]}>
                        <Input
                            placeholder="(99) 99999-9999"
                            maxLength={15}
                            onChange={(e) => {
                                let v = e.target.value.replace(/\D/g, "");

                                v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
                                v = v.replace(/(\d{5})(\d{4})$/, "$1-$2");

                                form.setFieldsValue({ phone: v });
                            }}
                        />
                    </Form.Item>

                    <Button htmlType="submit" type="primary">
                        Salvar
                    </Button>

                    <Button onClick={() => form.resetFields()} style={{ marginLeft: 8 }}>
                        Resetar
                    </Button>
                </Form>
            }
            {
                drawerType === 'edit' && <Form
                    layout="vertical"
                    form={forms}
                    onFinish={handleEditFinish}
                >
                    <Form.Item label="Nome" name="name" rules={[{ required: true, message: "Informe o nome" }]}>
                        <Input style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="CPF"
                        name="cpf"
                        rules={[{ required: true, message: "Informe o CPF" },
                        { pattern: /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, message: "CPF inválido" }]}
                    >
                        <Input
                            placeholder="000.000.000-00"
                            maxLength={14}
                            onChange={(e) => {
                                let v = e.target.value.replace(/\D/g, "");

                                v = v.replace(/(\d{3})(\d)/, "$1.$2");
                                v = v.replace(/(\d{3})(\d)/, "$1.$2");
                                v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

                                forms.setFieldsValue({ cpf: v });
                            }}
                        />
                    </Form.Item>

                    <Form.Item label="RG" name="rg" rules={[{ required: true, message: "Informe o RG" }]}>
                        <Input style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="Data de Nascimento"
                        name="birth_date"
                        rules={[{ required: true, message: "Informe a data de nascimento" }]}
                    >
                        <DatePicker
                            format="DD/MM/YYYY"
                            style={{ width: "100%" }}
                            disabledDate={(date) => date && date > dayjs()}
                        />
                    </Form.Item>
                    <Form.Item label="Telefone" name="phone" rules={[{ required: true }, { pattern: /^\(?\d{2}\)?\s?\d{5}-?\d{4}$/, message: "Telefone inválido" }]}>
                        <Input
                            placeholder="(99) 99999-9999"
                            maxLength={15}
                            onChange={(e) => {
                                let v = e.target.value.replace(/\D/g, "");

                                v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
                                v = v.replace(/(\d{5})(\d{4})$/, "$1-$2");

                                forms.setFieldsValue({ phone: v });
                            }}
                        />
                    </Form.Item>

                    <ConfigProvider
                        button={{ className: styles.linearGradientButton }}
                    >
                        <Button htmlType="submit" type="primary">
                            Salvar
                        </Button>
                    </ConfigProvider>
                    <Button onClick={handleBack} style={{ marginLeft: 8 }}>
                        Voltar
                    </Button>
                </Form>
            }

        </Drawer>
    )
}