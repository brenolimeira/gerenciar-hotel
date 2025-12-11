import { Card, Flex, Typography } from 'antd';

// import rooms from '../mock/quartos.json'
import { NavLink } from 'react-router-dom';
import axios from "axios";
import { useState, useEffect } from 'react';

function Home() {

    const [rooms, setRooms] = useState();

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/rooms/")
            .then(response => setRooms(response.data));
    }, []);

    return (
        <Flex gap={16}>
            {rooms ? rooms.map((room, index) => {
                return (
                    <NavLink
                        key={room.id}
                        to={`/room/${room.id}`}
                        style={{ textDecoration: "none" }}
                    >
                        <Card key={room.id}
                            title={<Typography.Title
                                level={3}>{room.name}</Typography.Title>}
                            variant="borderless"
                            style={{ width: 300/*, backgroundColor: room.ocupado ? "#A30000" : '#0A7500'*/ }}
                        >
                            <p>Capacidade de Hóspedes : {room.guest_capacity}</p>
                        </Card>
                    </NavLink>
                )
            }) : []}
        </Flex>
    );

}

export default Home;