import { useParams } from 'react-router-dom';
import rooms from '../mock/quartos.json';
import guests from '../mock/guest.json';
import { Table, Tag, Empty } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons';

export default function Room() {

    const { number } = useParams();
    const room = rooms.find(q => q.numero == number);
    const guest = guests.find(g => g.quarto == number);

    const expandColumns = [
        { title: 'Nome', dataIndex: 'name', key: 'name' },
        { title: 'Endereço', dataIndex: 'address', key: 'address' },
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
    ];

    const expandedRowRender = () => {


        if (!guest) {
            return (
                <Empty 
                    image={<CloseCircleOutlined style={{
                        fontSize: 48,
                    }}/>}
                    style={{
                        margin: 4,
                        padding: 0
                    }}
                    description={
                        <span style={{ fontSize: 14 }}>
                            Nenhum hóspede está ocupando este quarto
                        </span>
                    }
                />
            );
        }

        return (
            <Table
                columns={expandColumns}
                dataSource={guest ? [{
                    key: 1,
                    name: guest.nome,
                    address: `${guest.endereco.rua}, ${guest.endereco.numero}`
                }] : []}
                pagination={false}
            />
        );
    }

    if (!room) return <h2>Quarto não encontrado!</h2>;

    return (
        <>
            <Table
                columns={columns}
                expandable={{ 
                    expandedRowRender, 
                    defaultExpandAllRows: true
                    //defaultExpandedRowKeys: [String(room.numero)] 
                }}
                dataSource={[{
                    key: room.numero,
                    number: room.numero,
                    guest: room.quantidade_pessoas,
                    status: room.ocupado ? "Ocupado" : "Livre",
                    ocupado: room.ocupado
                }]}
                size='middle'
                pagination={false}
            />
        </>
    );
}