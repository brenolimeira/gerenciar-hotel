import { Button, ConfigProvider, Form, Input, Modal, Space, Table, message } from "antd";
import axios from "axios"
import { useState } from "react";
import { useButtonStyles } from "../styles/useButtonStyles";
import dayjs from "dayjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DrawerManagerGuests from "../components/DrawerManagerGuests";
import { formatCPF, formatPhone } from "../utils";

export default function Guests() {

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerType, setDrawerType] = useState(null);
    const [search, setSearch] = useState("");
    const [selectedGuest, setSelectedGuest] = useState(null);

    const [form] = Form.useForm();

    const queryClient = useQueryClient();

    const { styles } = useButtonStyles();

    // Funçao para carregar os hóspedes cadastrados
    const { data: guests } = useQuery({
        queryKey: ["guests"],
        queryFn: () => axios.get("http://127.0.0.1:8000/api/guests/").then(r => r.data)
    });

    // Funçao para deletar o hóspede selecionado
    const deleteMutation = useMutation({
        mutationFn: (id) =>
            axios.delete(`http://127.0.0.1:8000/api/guests/${id}/`),

        onSuccess: () => {
            message.success("Hóspede removido com sucesso");
            queryClient.invalidateQueries(["guests"]);
        },

        onError: (error) => {
            message.error(
                error?.response?.data?.detail ||
                error?.response?.data ||
                "Não foi possível remover o hóspede"
            );
        },
    });

    const filteredGuests = guests?.filter((guest) => {
        const term = search.toLowerCase();

        return Object.values({
            name: guest.name,
            cpf: guest.cpf,
            rg: guest.rg,
            phone: guest.phone,
            birth_date: dayjs(guest.birth_date).format("DD/MM/YYYY")
        })
            .join(" ")
            .toLowerCase()
            .includes(term);
    }
    );

    const openDrawer = (type, guest = null) => {
        setDrawerType(type);
        setSelectedGuest(guest);
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
        setDrawerType(null);
        setSelectedGuest(null);
    };

    // Funçao para confirmaçao de delete
    const handleDelete = (guest) => {
        Modal.confirm({
            title: "Remover hóspede?",
            content: `Você tem certeza que deseja remover o hóspede? "${guest.name}"?`,
            okText: "Sim",
            cancelText: "Cancelar",
            okType: "danger",

            onOk: () => deleteMutation.mutate(guest.id),
        });
    };

    const handleSelectGuest = (guest) => {
        form.resetFields();
        setSelectedGuest(guest);
        openDrawer('edit', guest)
    };

    const columns = [
        { title: 'Nome', dataIndex: 'name', key: 'name', responsive: ['xs', 'sm', 'md', 'lg', 'xl'] },
        {
            title: 'CPF',
            dataIndex: 'cpf',
            key: 'cpf',
            render: (cpf) => formatCPF(cpf),
            responsive: ['md', 'lg', 'xl']
        },
        { title: 'RG', dataIndex: 'rg', key: 'rg', responsive: ['lg', 'xl'] },
        {
            title: 'Data de Nascimento',
            dataIndex: 'birth_date',
            key: 'birth_date',
            render: (value) => value ? dayjs(value).format("DD/MM/YYYY") : "",
            responsive: ['md', 'lg', 'xl']
        },
        {
            title: 'Telefone',
            dataIndex: 'phone',
            key: 'phone',
            render: (phone) => formatPhone(phone),
            responsive: ['md', 'lg', 'xl']
        },
        {
            title: 'Ações',
            key: 'actions',
            render: (_, guest) => (
                <div>
                    <ConfigProvider
                        button={{
                            className: styles.linearGradientButton
                        }}
                    >
                        <Button
                            type="primary"
                            onClick={() => handleSelectGuest(guest)}
                        >
                            Editar
                        </Button>
                    </ConfigProvider>

                    <Button type="primary" danger onClick={() => handleDelete(guest)} style={{ marginLeft: 4 }}>
                        Remover
                    </Button>
                </div>
            )
        }
    ]

    if (!guests) return <h2>Nenhum Cliente Cadastrado!</h2>;

    return (
        <>
            <div style={{ width: "100%", height: "100vh", padding: 16 }}>
                <Space style={{ marginBottom: 16, width: "100%", justifyContent: "space-between" }}>
                    <Input
                        placeholder="Digite o nome do hóspede"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ width: 260, marginBottom: 3 }}
                    />
                    <ConfigProvider
                        button={{ className: styles.linearGradientButton }}
                    >
                        <Button
                            type="primary"
                            onClick={() => openDrawer("create")}
                        >
                            Cadastrar Hóspede
                        </Button>
                    </ConfigProvider>
                </Space>
                <Table
                    columns={columns}
                    dataSource={filteredGuests}
                    rowKey="id"
                    scroll={{ x: true, y: "70vh" }}
                    pagination={{ responsive: true }}
                    size="middle"
                    style={{ width: "100%" }}
                />
            </div>
            <DrawerManagerGuests
                drawerOpen={drawerOpen}
                drawerType={drawerType}
                closeDrawer={closeDrawer}
                forms={form}
                selectedGuest={selectedGuest}
                setSelectedGuest={setSelectedGuest}
            />
        </>
    )
}