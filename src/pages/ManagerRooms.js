import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Table, Form, Modal, message } from "antd";
import axios from "axios";
import { useState } from "react";
import DrawerManagerRooms from "../components/DrawerManagerRooms";

export default function ManagerRooms() {

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerType, setDrawerType] = useState(null);

    const [form] = Form.useForm();

    const [selectedRoom, setSelectedRoom] = useState(null);

    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: (id) =>
            axios.delete(`http://127.0.0.1:8000/api/rooms/${id}/`),

        onSuccess: () => {
            message.success("Quarto removido com sucesso");
            queryClient.invalidateQueries(["rooms"]);
        },

        onError: () => {
            message.error("Erro ao remover quarto");
        },
    });

    const { data: rooms } = useQuery({
        queryKey: ["rooms"],
        queryFn: () => axios.get("http://127.0.0.1:8000/api/rooms/").then(r => r.data)
    });

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

    return (
        <>
            <Table
                dataSource={rooms}
                rowKey="id"
                columns={[
                    { title: "Nome", dataIndex: "name" },
                    {
                        title: "Ações",
                        render: (_, room) => (
                            <>
                                <div>
                                    <Button key='edit' onClick={() => handleSelectRoom(room)} >Editar</Button>
                                    <Button danger onClick={() => handleDelete(room)}>Remover</Button>
                                </div>
                            </>
                        )
                    }
                ]}
            />
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