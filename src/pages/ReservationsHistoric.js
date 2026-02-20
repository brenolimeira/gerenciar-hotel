import api from '../service';
import dayjs from 'dayjs';
import "dayjs/locale/pt-br";

import { Empty, Space, Table, Tag } from "antd";
import { useEffect, useState } from 'react';

dayjs.locale("pt-br");

export default function ReservationsHistoric() {

    const [booking, setBooking] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5
    });

    const statusMap = {
        active: { label: "Ocupado", color: "red" },
        completed: { label: "Concluído", color: "green" },
        canceled: { label: "Cancelado", color: "volcano" },
        reserved: { label: "Reservado", color: "blue" }
    };

    useEffect(() => {
        api.get(`/api/bookings/`)
            .then(res => {
                setBooking(res.data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const columns = [
        { title: 'Quarto', dataIndex: 'number', key: 'number' },
        { title: 'Hóspedes', dataIndex: 'guest', key: 'guest' },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                const s = statusMap[status];
                return <Tag color={s?.color}>{s?.label}</Tag>;
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
    ]

    const expandColumns = [
        { title: 'Nome do Hóspede', dataIndex: 'name', key: 'name' },
    ]

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

    return (
        <>
            {booking.length > 0 ? (
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Table
                        loading={loading}
                        columns={columns}
                        expandable={{
                            expandedRowRender,
                            defaultExpandAllRows: false
                            //defaultExpandedRowKeys: [String(room.numero)] 
                        }}
                        dataSource={booking.map(booki => ({
                            key: booki.id,
                            id: booki.id,
                            number: booki.room.name,
                            guest: booki.guest?.length || 0,
                            guests: booki.guest,
                            status: booki.status,
                            reservation_start: booki.reservation_start,
                            reservation_end: booki.reservation_end,
                            check_in: booki.check_in,
                            check_out: booki.check_out
                        }))}
                        size='middle'
                        pagination={{
                            ...pagination,
                            showSizeChanger: true,
                            pageSizeOptions: ['5', '10', '20', '50'],
                            onChange: (page, pageSize) => {
                                setPagination({
                                    current: page,
                                    pageSize
                                });
                            }
                        }}
                    />
                </Space>
            ) : (
                <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Empty description="Histórico vazio" />
                </div>
            )}
        </>
    )
}