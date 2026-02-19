import { useParams } from 'react-router-dom';
import { Table, Tag, Button, ConfigProvider, Popconfirm, Space, Empty } from 'antd'
import { CheckOutlined } from '@ant-design/icons';
import { useButtonStyles } from "../styles/useButtonStyles";
import { useEffect, useState } from 'react';
import axios from 'axios';

import dayjs from 'dayjs';
import "dayjs/locale/pt-br";

import api from '../service';

dayjs.locale("pt-br");

export default function Room() {

    const { number } = useParams();

    const [booking, setBooking] = useState();
    // const [guests, setGuests] = useState([]);
    const { styles } = useButtonStyles();

    useEffect(() => {
        api.get(`/api/bookings/?room=${number}&status=active,reserved`)
            .then(res => {
                setBooking(res.data);
            })
            .catch(err => console.error(err));
    }, [number]);

    // useEffect(() => {
    //     if (booking) {
    //         setGuests(booking.flatMap(b => b.guest));
    //     }
    // }, [booking])

    const expandColumns = [
        { title: 'Nome do Hóspede', dataIndex: 'name', key: 'name' },
    ]

    const columns = [
        { title: 'Quarto', dataIndex: 'number', key: 'number' },
        { title: 'Hóspedes', dataIndex: 'guest', key: 'guest' },
        {
            title: 'Status',
            key: 'status',
            render: (_, record) => {
                return (
                    <Tag color={record.ocupado ? "red" : "blue"}>
                        {record.ocupado ? "Ocupado" : "Reservado"}
                    </Tag>
                );
            }
        },
        {
            title: 'Check in',
            dataIndex: 'check_in',
            key: 'check_in',
            render: (date) =>
                date ? dayjs(date).format("DD/MM/YYYY HH:mm") : ""
        },
        {
            title: 'Check out',
            dataIndex: 'check_out',
            key: 'check_out',
            render: (date) =>
                date ? dayjs(date).format("DD/MM/YYYY HH:mm") : ""
        },
        {
            title: 'Período',
            key: 'periodo',
            render: (_, record) => {
                const start = record.reservation_start
                    ? dayjs(record.reservation_start).format("DD MMM HH:mm")
                    : "-";

                const end = record.reservation_end
                    ? dayjs(record.reservation_end).format("DD MMM HH:mm")
                    : "-";

                return (
                    <div>
                        <div>Início: {start}</div>
                        <div>Fim: {end}</div>
                    </div>
                );
            }
        },
        {
            title: 'Ações',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    {record.status === "reserved" && (
                        <ConfigProvider
                            button={{
                                className: styles.linearGradientButton
                            }}
                        >
                            <Popconfirm
                                title="Confirmar check-in?"
                                onConfirm={() => handleCheckin(record.id)}
                            >
                                <Button
                                    type='primary'
                                    icon={<CheckOutlined />}>
                                    Check-in
                                </Button>
                            </Popconfirm>
                        </ConfigProvider>
                    )}

                    {record.status === "active" && (
                        <Button
                            type="primary"
                            icon={<CheckOutlined />}
                            onClick={() => handleCheckout(record.id)}
                        >
                            Checkout
                        </Button>
                    )}

                    {["reserved", "active"].includes(record.status) && (
                        <Button danger onClick={() => handleCancel(record.id)}>
                            Cancelar
                        </Button>
                    )}
                </Space>
            )
        },
    ];

    const handleCheckout = async (id) => {
        try {
            const res = await axios.post(
                `http://127.0.0.1:8000/api/bookings/${id}/checkout/`
            );

            const updatedBooking = res.data;
            setBooking(prev =>
                prev.map(b =>
                    b.id === id ? updatedBooking : b
                )
            );

        } catch (err) {
            console.error(err);
            alert("Erro ao realizar checkout");
        }
    };

    const handleCheckin = async (id) => {
        try {
            const res = await api.post(`/api/bookings/${id}/checkin/`);
            updateBooking(res.data);
        } catch {
            alert("Erro ao realizar check-in");
        }
    };

    const handleCancel = async (id) => {
        try {
            const res = await api.post(`/api/bookings/${id}/cancel/`);
            updateBooking(res.data);
        } catch {
            alert("Erro ao cancelar reserva");
        }
    };

    const updateBooking = (updated) => {
        setBooking(prev =>
            prev.map(b => b.id === updated.id ? updated : b)
        );
    };

    const expandedRowRender = (record) => {
        return (
            <Table
                columns={expandColumns}
                dataSource={record.guests.map(guest => ({
                    key: guest.id,
                    name: guest.name
                }))}
                pagination={false}
            />
        );
    };

    if (!booking) return <h2>Nenhuma Hospedagem encontrada!</h2>;

    // const activeBookings = booking?.filter(b => b.status === "active") || [];

    return (
        <>
            {booking.length > 0 ?
                (
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <Table
                            columns={columns}
                            expandable={{
                                expandedRowRender,
                                defaultExpandAllRows: true
                                //defaultExpandedRowKeys: [String(room.numero)] 
                            }}
                            dataSource={booking.map(booki => ({
                                key: booki.id,
                                id: booki.id,
                                number: booki.room.name,
                                guest: booki.guest.length,
                                guests: booki.guest,
                                status: booki.status,
                                ocupado: booki.status === 'active',
                                reservation_start: booki.reservation_start,
                                reservation_end: booki.reservation_end,
                                check_in: booki.check_in,
                                check_out: booki.check_out
                            }))}
                            size='middle'
                            pagination={true}
                        />
                        {/* <ConfigProvider
                            button={{
                                className: styles.linearGradientButton
                            }}
                        >
                            <Button type='primary' size='large' icon={<CheckOutlined />} onClick={() => handleCheckout(booki.id)}>
                                Realizar Check out
                            </Button>
                        </ConfigProvider> */}
                    </Space>
                )
                : (
                    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Empty description="Quarto sem Reservas" />
                    </div>
                )}
        </>
    );
}