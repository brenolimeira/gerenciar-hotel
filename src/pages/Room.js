import { useParams } from 'react-router-dom';
import { Table, Tag, Button, Popconfirm, Space, Empty, Spin } from 'antd'
import { CheckOutlined } from '@ant-design/icons';
import { useButtonStyles } from "../styles/useButtonStyles";
import { useEffect, useState } from 'react';

import dayjs from 'dayjs';
import "dayjs/locale/pt-br";

import api from '../service';

dayjs.locale("pt-br");

export default function Room() {

    const { number } = useParams();

    const [booking, setBooking] = useState([]);
    // const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingBtn, setLoadingBtn] = useState(null);
    const { styles } = useButtonStyles();

    useEffect(() => {
        setLoading(true);
        api.get(`/api/bookings/?room=${number}&status=active,reserved`)
            .then(res => {
                setBooking(res.data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
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
        { title: 'Quarto', dataIndex: 'number', key: 'number', responsive: ['xs', 'sm', 'md', 'lg', 'xl'] },
        { title: 'Hóspedes', dataIndex: 'guest', key: 'guest', responsive: ['md', 'lg', 'xl'], size: '80px' },
        {
            title: 'Status',
            key: 'status',
            size: '80px',
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
            responsive: ['md', 'lg', 'xl'],
            render: (date) =>
                date ? dayjs(date).format("DD/MM/YYYY HH:mm") : ""
        },
        {
            title: 'Check out',
            dataIndex: 'check_out',
            key: 'check_out',
            responsive: ['md', 'lg', 'xl'],
            render: (date) =>
                date ? dayjs(date).format("DD/MM/YYYY HH:mm") : ""
        },
        {
            title: 'Período',
            key: 'periodo',
            responsive: ['md', 'lg', 'xl'],
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

                    {record.status === "reserved" && record.status === "active" && (
                        <Popconfirm
                            title="Confirmar check-in?"
                            onConfirm={() => handleCheckin(record.id)}
                        >
                            <Button
                                type="primary"
                                icon={<CheckOutlined />}
                                className={styles.accentButton}
                            >
                                Check-in
                            </Button>
                        </Popconfirm>
                    )}

                    {record.status === "active" && (
                        <Button
                            type="primary"
                            icon={<CheckOutlined />}
                            className={styles.primaryButton}
                            loading={loadingBtn === record.id}
                            onClick={() => handleCheckout(record.id)}
                        >
                            Checkout
                        </Button>
                    )}

                    {["reserved", "active"].includes(record.status) && (
                        <Button
                            danger
                            className={styles.dangerButton}
                            onClick={() => handleCancel(record.id)}
                        >
                            Cancelar
                        </Button>
                    )}

                </Space>
            )
        },
    ];

    const handleCheckout = async (id) => {
        try {
            setLoadingBtn(id);
            const res = await api.post(`/api/bookings/${id}/checkout/`);
            const updatedBooking = res.data;
            setBooking(prev =>
                prev.map(b =>
                    b.id === id ? updatedBooking : b
                )
            );

        } catch (err) {
            console.error(err);
            alert("Erro ao realizar checkout");
        } finally {
            setLoadingBtn(null);
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

    if (loading) {
        return (
            <div style={{
                flex:1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <Spin size="large" />
            </div>
        );
    }

    // const activeBookings = booking?.filter(b => b.status === "active") || [];

    return (
        <>
            {booking.length > 0 ?
                (
                    <div
                        style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            minHeight: 0,
                        }}
                    >
                        <Table
                            sticky
                            bordered={false}
                            rowClassName={() => "table-row"}
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
                            pagination
                            style={{ flex: 1 }}
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
                    </div>
                )
                : (
                    <div style={{ flex:1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Empty description="Quarto sem Reservas" />
                    </div>
                )}
        </>
    );
}