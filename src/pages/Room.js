import { useParams } from 'react-router-dom';
import { Table, Tag, Button, Popconfirm, Space, Empty, Spin, Grid, Flex, Tooltip, Modal } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useButtonStyles } from "../styles/useButtonStyles";
import { useEffect, useState } from 'react';

import dayjs from 'dayjs';
import "dayjs/locale/pt-br";

import api from '../service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';

dayjs.locale("pt-br");

const { useBreakpoint } = Grid;

export default function Room() {

    const { number } = useParams();

    const [booking, setBooking] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingBtn, setLoadingBtn] = useState(null);
    const { styles } = useButtonStyles();
    const screen = useBreakpoint();
    const isMobile = !screen.md;


    const fetchBookings = async () => {
        try {
            setLoading(true);

            const res = await api.get(
                `/api/bookings/?room=${number}&status=active,reserved`
            );
            setBooking(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [number])

    const hasActiveBooking = booking.some(b => b.status === "active");

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
                <Flex wrap justify='center' align='center' gap={8}>

                    {record.status === "reserved" && !hasActiveBooking && (
                        <Button
                            type="primary"
                            className={styles.accentButton}
                            onClick={() => handleCheck(record.id)}
                        >
                            {
                                isMobile ?
                                    <Tooltip title="Check-in">
                                        <FontAwesomeIcon icon={faArrowRightToBracket} style={{ fontSize: 12 }} />
                                    </Tooltip>
                                    :
                                    <Flex gap={4} align='center'>
                                        <FontAwesomeIcon icon={faArrowRightToBracket} style={{ fontSize: 12 }} />
                                        Check-in
                                    </Flex>
                            }
                        </Button>
                    )}

                    {record.status === "active" && (
                        <Button
                            type="primary"
                            className={styles.primaryButton}
                            loading={loadingBtn === record.id}
                            onClick={() => handleCheckout(record.id)}
                        >
                            {
                                isMobile ?
                                    <Tooltip title="Check-out">
                                        <FontAwesomeIcon icon={faArrowRightFromBracket} style={{ fontSize: 12 }} />
                                    </Tooltip>
                                    :
                                    <Flex gap={4} align='center'>
                                        <FontAwesomeIcon icon={faArrowRightFromBracket} style={{ fontSize: 12 }} />
                                        Check-out
                                    </Flex>
                            }
                        </Button>
                    )}

                    {["reserved", "active"].includes(record.status) && (
                        <Button
                            danger
                            className={styles.dangerButton}
                            onClick={() => handleCancel(record.id)}
                        >
                            {
                                isMobile ?
                                    <Tooltip title="Cancelar">
                                        <CloseOutlined />
                                    </Tooltip>
                                    :
                                    <Flex gap={4} align="center">
                                        <CloseOutlined />
                                        Cancelar
                                    </Flex>
                            }
                        </Button>
                    )}

                </Flex>
            )
        },
    ];

    const handleCheckout = async (id) => {
        try {
            setLoadingBtn(id);
            const res = await api.post(`/api/bookings/${id}/checkout/`);
            const updatedBooking = res.data;
            await fetchBookings();
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

    const handleCheck = (id) => {
        Modal.confirm({
            title: "Realizar Check-in?",
            content: `Você tem certeza que deseja realizar o Check-in?`,
            okText: "Sim",
            cancelText: "Cancelar",
            okType: "primary",

            onOk: () => handleCheckin(id),
        });
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
                flex: 1,
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
                            scroll={{ x: 'auto' }}
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
                    </div>
                )
                : (
                    <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Empty description="Quarto sem Reservas" />
                    </div>
                )}
        </>
    );
}