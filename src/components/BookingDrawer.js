import { Drawer, Spin, Form, DatePicker, Button, message, Select } from "antd";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useState, useEffect } from "react";
const { RangePicker } = DatePicker;

dayjs.extend(isBetween);

export default function BookingDrawer({ open, onClose }) {

    const [form] = Form.useForm();
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [guestSearch, setGuestSearch] = useState("");

    useEffect(() => {
        if (open) {
            setSelectedRoomId(null);
            form.resetFields();
        }
    }, [open]);

    const { data: guests = [] } = useQuery({
        queryKey: ["guests", guestSearch],
        queryFn: () =>
            axios
                .get(`http://127.0.0.1:8000/api/guests/?search=${guestSearch}`)
                .then(r => r.data),
        enabled: typeof guestSearch === "string"
    });

    const { data: rooms = [] } = useQuery({
        queryKey: ["rooms"],
        queryFn: () => axios.get("http://127.0.0.1:8000/api/rooms/").then(r => r.data)
    });

    const { data: room, isLoading } = useQuery({
        queryKey: ['room', selectedRoomId],
        enabled: !!selectedRoomId,
        queryFn: async () => {
            const res = await axios.get(`http://127.0.0.1:8000/api/rooms/${selectedRoomId}/`);
            return res.data;
        }
    });


    const { data: blockedDates = [] } = useQuery({
        queryKey: ['blocked-dates', selectedRoomId],
        enabled: !!selectedRoomId,
        queryFn: () =>
            axios
                .get(`http://127.0.0.1:8000/api/bookings/blocked-dates/${selectedRoomId}/`)
                .then(res => res.data)
    });

    const handleApiError = (error) => {
        if (!error.response) {
            message.error("Erro de conexão com o servidor");
            return;
        }

        const data = error.response.data;

        // string simples
        if (typeof data === "string") {
            message.error(data);
            return;
        }

        // non_field_errors (validação geral)
        if (data.non_field_errors) {
            message.error(data.non_field_errors[0]);
            return;
        }

        if (data.detail) {
            message.error(data.detail);
            return;
        }

        // ERROS POR CAMPO
        const firstFieldError = Object.values(data)?.[0];

        if (Array.isArray(firstFieldError)) {
            message.error(firstFieldError[0]);
            return;
        }

        // fallback final
        message.error("Erro ao criar reserva");
    };

    const onFinish = async (values) => {
        try {
            const [start, end] = values.reservation_period;

            if (start.isAfter(end)) {
                message.error("Data inicial não pode ser maior que a final");
                return;
            }

            await axios.post("http://127.0.0.1:8000/api/bookings/", {
                room_id: selectedRoomId,
                guest_ids: values.guest_ids,
                reservation_start: start.toISOString(),
                reservation_end: end.toISOString(),
            });

            message.success("Reserva criada com sucesso!");
            form.resetFields();
            onClose();
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleClose = () => {
        setSelectedRoomId(null);
        form.resetFields();
        onClose();
    };

    const disabledDate = (current) => {
        if (!current) return false;

        return blockedDates.some(({ reservation_start, reservation_end }) => {
            return current.isBetween(
                dayjs(reservation_start),
                dayjs(reservation_end),
                "day",
                '[]'
            );
        });
    };

    const disabledTime = (date) => {
        if (!date) return {};

        const ranges = blockedDates.filter(r =>
            date.isBetween(dayjs(r.reservation_start), dayjs(r.reservation_end), "day", "[]")
        );

        const disabledHours = [];

        ranges.forEach(r => {
            const start = dayjs(r.reservation_start);
            const end = dayjs(r.reservation_end);

            for (let h = start.hour(); h <= end.hour(); h++) {
                disabledHours.push(h);
            }
        });

        return {
            disabledHours: () => [...new Set(disabledHours)]
        };
    };

    return (
        <Drawer
            title="Nova Reserva"
            size={400}
            open={open}
            onClose={handleClose}
        >
            <Form layout="vertical" form={form} onFinish={onFinish}>

                {/* SELECT QUARTO */}
                <Form.Item
                    label="Quarto"
                    name="room_id"
                    rules={[{ required: true, message: "Selecione um quarto" }]}
                >
                    <Select
                        placeholder="Selecione um quarto"
                        onChange={(value) => {
                            setSelectedRoomId(value);
                            form.setFieldValue("reservation_period", null);
                        }}
                        options={rooms.map(r => ({
                            value: r.id,
                            label: r.name
                        }))}
                    />
                </Form.Item>

                {/* INFO QUARTO */}
                {isLoading ? (
                    <Spin />
                ) : room && (
                    <>
                        <p>Capacidade: {room.guest_capacity} Hóspedes</p>

                        {/* DATA */}
                        <Form.Item
                            label="Período da Reserva"
                            name="reservation_period"
                            rules={[{ required: true, message: "Informe o período" }]}
                        >
                            <RangePicker
                                showTime
                                style={{ width: "100%" }}
                                disabledDate={disabledDate}
                                disabledTime={disabledTime}
                            />
                        </Form.Item>

                        {/* HOSPEDES */}
                        <Form.Item
                            label="Hóspedes"
                            name="guest_ids"
                            rules={[{ required: true, message: "Selecione ao menos um hóspede" }]}
                        >
                            <Select
                                mode="multiple"
                                showSearch
                                placeholder="Digite para buscar hóspedes"
                                onSearch={(value) => setGuestSearch(value)}
                                filterOption={false}
                                options={guests.map(g => ({
                                    value: g.id,
                                    label: g.name
                                }))}
                            />
                        </Form.Item>

                        <Button type="primary" htmlType="submit" block>
                            Reservar
                        </Button>
                    </>
                )}

            </Form>
        </Drawer>
    )
}