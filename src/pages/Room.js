import { useParams } from 'react-router-dom';
import { Table, Tag, Button, ConfigProvider } from 'antd'
import { CheckOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useButtonStyles } from "../styles/useButtonStyles";
import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import api from '../service'
import { Space } from 'antd';

export default function Room() {

    const { number } = useParams();

    console.log(number)

    const [booking, setBooking] = useState();
    // const [guests, setGuests] = useState([]);
    const { styles } = useButtonStyles();

    useEffect(() => {
        api.get(`/api/bookings/?room=${number}&status=active`)
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
                    <Tag color={record.ocupado ? "red" : "green"}>
                        {record.ocupado ? "Ocupado" : "Livre"}
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
    ];

    const handleCheckout = async (id) => {
        try {
            const res = await axios.post(
                `http://127.0.0.1:8000/api/bookings/${id}/checkout/`
            );

            const updatedBooking = res.data;
            console.log(res.data);
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
    }

    if (!booking) return <h2>Nenhuma Hospedagem encontrada!</h2>;

    // const activeBookings = booking?.filter(b => b.status === "active") || [];

    return (
        <>
            {booking.length > 0 ? booking.map(booki => {
                return (
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <Table
                            columns={columns}
                            expandable={{
                                expandedRowRender,
                                defaultExpandAllRows: true
                                //defaultExpandedRowKeys: [String(room.numero)] 
                            }}
                            dataSource={[{
                                key: booki.id,
                                number: booki.room.name,
                                guest: booki.guest.length,
                                guests: booki.guest,
                                status: booki.status === 'active' ? "Ocupado" : "Livre",
                                ocupado: booki.status === 'active',
                                name: booki.guest.name,
                                check_in: booki.check_in,
                                check_out: booki.check_out
                            }]}
                            size='middle'
                            pagination={false}
                        />
                        <ConfigProvider
                            button={{
                                className: styles.linearGradientButton
                            }}
                        >
                            <Button type='primary' size='large' icon={<CheckOutlined />} onClick={() => handleCheckout(booki.id)}>
                                Realizar Check out
                            </Button>
                        </ConfigProvider>
                    </Space>
                );
            }) : (
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "50vh",
                }}>
                    <ConfigProvider
                        button={{
                            className: styles.linearGradientButton
                        }}
                    >
                        <Button type='primary' size='large' icon={<PlusCircleOutlined />}>
                            Criar Hospedagem
                        </Button>
                    </ConfigProvider>
                </div>
            )}
        </>
    );
}