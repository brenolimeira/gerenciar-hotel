import { Drawer, Typography, Spin, Form, DatePicker, Button, message, Select } from "antd";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

const { RangePicker } = DatePicker;

dayjs.extend(isBetween);

export default function BookingDrawer({ open, onClose, roomId }) {

    const [form] = Form.useForm();

    const { data: guests } = useQuery({
        queryKey: ["guests"],
        queryFn: () => axios.get("http://127.0.0.1:8000/api/guests/").then(r => r.data)
    });

    const { data: room, isLoading } = useQuery({
        queryKey: ['room', roomId],
        enabled: !!roomId,
        queryFn: async () => {
            const res = await axios.get(`http://127.0.0.1:8000/api/rooms/${roomId}/`);
            return res.data;
        }
    });

    const { data: blockedDates = [] } = useQuery({
        queryKey: ['blocked-dates', roomId],
        enabled: !!roomId,
        queryFn: () =>
            axios
                .get(`http://127.0.0.1:8000/api/bookings/blocked-dates/${roomId}/`)
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

        // detail
        if (data.detail) {
            message.error(data.detail);
            return;
        }

        // 🔥 ERROS POR CAMPO (SEU CASO)
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
                room_id: roomId,
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

    const disabledDate = (current) => {
        if (!current) return false;

        return blockedDates.some(({ reservation_start, reservation_end }) => {
            return current.isBetween(
                dayjs(reservation_start),
                dayjs(reservation_end),
                null,
                '[]'
            );
        });
    };

    return (
        <Drawer
            title="Nova Reserva"
            size={400}
            open={open}
            onClose={onClose}
        >
            {isLoading ? (
                <Spin />
            ) : room ? (
                <>
                    <Typography.Title level={5}>{room.name}</Typography.Title>
                    <p>Capacidade: {room.guest_capacity}</p>

                    <Form layout="vertical" form={form} onFinish={onFinish}>
                        <Form.Item
                            label="Período da Reserva"
                            name="reservation_period"
                            rules={[{ required: true, message: "Informe o período" }]}
                        >
                            <RangePicker showTime
                                style={{ width: "100%" }}
                                disabledDate={disabledDate}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Hóspedes"
                            name="guest_ids"
                            rules={[{ required: true, message: "Selecione ao menos um hóspede" }]}
                        >
                            <Select
                                mode="multiple"
                                placeholder="Selecione os hóspedes"
                                optionFilterProp="label"
                                options={guests?.map(g => ({
                                    value: g.id,
                                    label: g.name
                                }))}
                            />
                        </Form.Item>

                        <Button type="primary" htmlType="submit" block>
                            Reservar
                        </Button>
                    </Form>
                </>
            ) : null}
        </Drawer>
    )
}