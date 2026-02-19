import { Card, Flex, Typography, Button, Input, ConfigProvider } from 'antd';
import { NavLink } from 'react-router-dom';
import api from '../service';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import BookingDrawer from '../components/BookingDrawer';
import styled from 'styled-components';
import { useButtonStyles } from "../styles/useButtonStyles";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWind, faFan, faBabyCarriage, faPeopleRoof, faBed } from "@fortawesome/free-solid-svg-icons";

const StyledDiv = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
`;
const HeaderBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 12px;
`;

function Home() {

    const { styles } = useButtonStyles();

    const [open, setOpen] = useState(false);

    const [search, setSearch] = useState("");

    const { data: rooms = [] } = useQuery({
        queryKey: ['rooms'],
        queryFn: async () => {
            const res = await api.get("/api/rooms/");
            return res.data;
        }
    });

    const openDrawer = () => {
        setOpen(true);
    };

    const closeDrawer = () => {
        setOpen(false);
    };

    const filteredRooms = rooms.filter(room =>
        room.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <HeaderBar>
                <Input
                    placeholder="Pesquisar quarto..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    prefix={<SearchOutlined />}
                    style={{ maxWidth: 300 }}
                />
                <ConfigProvider
                    button={{ className: styles.linearGradientButton }}
                >
                    <Button
                        type='primary'
                        icon={<PlusOutlined />}
                        onClick={() => openDrawer()}
                    >
                        Reservar Quarto
                    </Button>
                </ConfigProvider>
            </HeaderBar>
            <StyledDiv>
                {filteredRooms ? filteredRooms.map((room, index) => {
                    return (

                        <Card key={room.id}
                            title={
                                <Flex gap={24} align="center" justify="space-between">
                                    <NavLink
                                        key={room.id}
                                        to={`/room/${room.id}`}
                                        style={{ textDecoration: "none" }}
                                    >
                                        <Typography.Title level={3}>
                                            <Flex gap={24} align='center' justify='space-between'>
                                                {room.name}
                                            </Flex>
                                        </Typography.Title>
                                    </NavLink>
                                </Flex>
                            }
                            variant="borderless"
                            style={{ width: 300, minHeight: '20vh' }}
                        >
                            {room.air_conditioning && <p><FontAwesomeIcon icon={faWind} /> Ar Condicionado</p>}
                            {room.crib && <p><FontAwesomeIcon icon={faBabyCarriage} /> Berço</p>}
                            {room.fan && <p> <FontAwesomeIcon icon={faFan} /> Ventilador</p>}
                            {room.guest_capacity && <p><FontAwesomeIcon icon={faPeopleRoof} /> Capacidade Total - {room.guest_capacity} pessoas </p>}
                            {room.double_beds !== 0 && <p><FontAwesomeIcon icon={faBed} /> Camas de casal - {room.double_beds} </p>}
                            {room.single_beds !== 0 && <p><FontAwesomeIcon icon={faBed} /> Camas de solteiro - {room.single_beds} </p>}
                        </Card>
                    )
                }) : []}
            </StyledDiv >

            <BookingDrawer
                open={open}
                onClose={closeDrawer}
            />
        </>
    );

}

export default Home;