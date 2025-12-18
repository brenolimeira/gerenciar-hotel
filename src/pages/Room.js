import { useParams } from 'react-router-dom';
import { Table, Tag, Button, ConfigProvider } from 'antd'
import { CheckOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';
import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

import { Space } from 'antd';

const useStyle = createStyles(({ prefixCls, css }) => ({
    linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
      > span {
        position: relative;
      }

      &::before {
        content: '';
        background: linear-gradient(135deg, #191E26, #3E4C59);
        position: absolute;
        inset: -1px;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `,
}));

export default function Room() {

    const { number } = useParams();

    const [booking, setBooking] = useState();
    const [guests, setGuests] = useState([]);
    const { styles } = useStyle();

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/bookings/room/${number}/`)
            .then(res => {
                setBooking(res.data);
            })
            .catch(err => console.error(err));
    }, [number]);

    useEffect(() => {
        if (booking) {
            booking.forEach(booki => {
                setGuests(booki.guest)
            });
        }
    }, [booking])

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
            render: (date) => dayjs(date).format("DD/MM/YYYY")
        },
        {
            title: 'Check out',
            dataIndex: 'check_out',
            key: 'check_out',
            render: (date) => {
                if (date) {
                    return dayjs(date).format("DD/MM/YYYY")
                } else {
                    return ""
                }
            }
        },
    ];

    const expandedRowRender = () => {
        return (
            <Table
                columns={expandColumns}
                dataSource={guests.map(guest => ({
                    key: guest.id,
                    name: guest.name
                }))}
                pagination={false}
            />
        );
    }

    if (!booking) return <h2>Nenhuam Hospedagem encontrada!</h2>;

    return (
        <>
            {booking.length !== 0 ? booking.map(booki => {
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
                                guest: guests.length,
                                status: booki.status === 'active' ? "Ocupado" : "Livre",
                                ocupado: () => {
                                    if (booki.status === 'active') {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                },
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
                            <Button type='primary' size='large' icon={<CheckOutlined />}>
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
                    height: "50vh", // ou 100vh se quiser no meio da tela
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