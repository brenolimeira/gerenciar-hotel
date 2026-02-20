import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Table, Form, Modal, Space, Input, message, ConfigProvider, Spin } from "antd";
import api from '../service';
import { useState } from "react";
import DrawerManagerRooms from "../components/DrawerManagerRooms";
import { useButtonStyles } from "../styles/useButtonStyles";

export default function ManagerRooms() {

    const { styles } = useButtonStyles();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerType, setDrawerType] = useState(null);
    const [search, setSearch] = useState("");
    const [form] = Form.useForm();
    const [selectedRoom, setSelectedRoom] = useState(null);

    const queryClient = useQueryClient();

    // Funçao para deletar o quarto selecionado
    const deleteMutation = useMutation({
        mutationFn: (id) =>
            api.delete(`/api/rooms/${id}/`),

        onSuccess: () => {
            message.success("Quarto removido com sucesso");
            queryClient.invalidateQueries(["rooms"]);
        },

        onError: (error) => {
            message.error(error?.response?.data?.detail ||
                error?.response?.data ||
                "Erro ao excluir quarto"
            );
        },
    });

    // Funçao para carregar todos os quartos
    const { data: rooms = [], isLoading } = useQuery({
        queryKey: ["rooms"],
        queryFn: () => api.get("/api/rooms/").then(r => r.data)
    });

    // Pesquisar quartos
    const filteredRooms = rooms.filter(room =>
        room.name.toLowerCase().includes(search.toLowerCase())
    );

    const openDrawer = (type, room = null) => {
        setDrawerType(type);
        setSelectedRoom(room);
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
        setDrawerType(null);
        setSelectedRoom(null);
    };

    // Funçao para confirmaçao de delete
    const handleDelete = (room) => {
        Modal.confirm({
            title: "Remover quarto?",
            content: `Você tem certeza que deseja remover o quarto "${room.name}"?`,
            okText: "Sim",
            cancelText: "Cancelar",
            okType: "danger",

            onOk: () => deleteMutation.mutate(room.id),
        });
    };

    const handleSelectRoom = (room) => {
        setSelectedRoom(room);
        form.setFieldsValue(room);
        openDrawer('edit', room)
    };

    if (isLoading) {
        return (
            <div style={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <>
            <div style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
            }}>
                <div style={{ width: "100%", height: "100vh", padding: 16 }}>
                    <Space style={{ marginBottom: 16, width: "100%", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <Input
                                placeholder="Digite o nome do quarto"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                style={{ width: 260 }}
                            />
                        </div>
                        <ConfigProvider
                            button={{ className: styles.linearGradientButton }}
                        >
                            <Button
                                type="primary"
                                onClick={() => openDrawer("create")}
                            >
                                Cadastrar Quarto
                            </Button>
                        </ConfigProvider>
                    </Space>
                    <Table
                        dataSource={filteredRooms}
                        rowKey="id"
                        loading={isLoading}
                        columns={[
                            { title: "Nome", dataIndex: "name" },
                            {
                                title: "Ações",
                                render: (_, room) => (
                                    <>
                                        <div>
                                            <ConfigProvider
                                                button={{ className: styles.linearGradientButton }}
                                            >
                                                <Button onClick={() => handleSelectRoom(room)} style={{ marginRight: 5 }} >Editar</Button>
                                            </ConfigProvider>
                                            <Button danger onClick={() => handleDelete(room)}>Remover</Button>
                                        </div>
                                    </>
                                )
                            }
                        ]}
                    />
                </div>
            </div>
            <DrawerManagerRooms
                drawerOpen={drawerOpen}
                drawerType={drawerType}
                forms={form}
                selectedRoom={selectedRoom}
                closeDrawer={closeDrawer}
                setSelectedRoom={setSelectedRoom}
            />
        </>
    )
}