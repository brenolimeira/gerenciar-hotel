import { Card, Flex, Typography, Tag } from 'antd';
import { NavLink } from 'react-router-dom';
import axios from "axios";
import { useQuery } from '@tanstack/react-query';

function Home() {

    const { data: rooms = [] } = useQuery({
        queryKey: ['rooms'],
        queryFn: async () => {
            const res = await axios.get("http://127.0.0.1:8000/api/rooms/");
            return res.data;
        }
    });

    return (
        <Flex
            gap={16}
            wrap="wrap"
            align="flex-start"
        >
            {rooms ? rooms.map((room, index) => {
                return (
                    <NavLink
                        key={room.id}
                        to={`/room/${room.id}`}
                        style={{ textDecoration: "none" }}
                    >
                        <Card key={room.id}
                            title={
                                <Typography.Title level={3}>
                                    <Flex gap={24} align='center' justify='space-between'>
                                        {room.name}
                                        <Tag color={room.occupied ? "#A30000" : '#0A7500'} style={{ maxHeight: '3vh' }}>
                                            {room.occupied ? "Ocupado" : "Livre"}
                                        </Tag>
                                    </Flex>
                                </Typography.Title>
                            }
                            variant="borderless"
                            style={{ width: 300, height: '30vh' }}
                        >
                            <p>Capacidade de Hóspedes : {room.current_guests} / {room.guest_capacity}</p>
                            {room.air_conditioning ? <p>Ar Condicionado</p> : []}
                            {room.crib ? <p>Berço</p> : []}
                            <p>Camas de Casal: {room.double_beds}</p>
                            <p>Camas de Solteiro: {room.single_beds}</p>
                        </Card>
                    </NavLink>
                )
            }) : []}
        </Flex>
    );

}

export default Home;