import { Card, Flex, Typography, Button, Input, ConfigProvider, Spin } from 'antd';
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
    flex:1;
    width:100%;
    min-width:0;

    display:grid;
    grid-template-columns:repeat(auto-fill,260px);
    justify-content:start;

    gap:24px;
    padding:24px;
    overflow-y:auto;
    align-items:start;
`;
const HeaderBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    gap: 12px;
`;

const StyledCard = styled(Card)`
  border-radius:16px !important;
  background:${({ theme }) => theme.cardBackground} !important;
  border:1px solid ${({ theme }) => theme.border};
  transition:.25s;
  cursor:pointer;

  min-height:130px;
  max-width:260px;

  box-shadow:${({ theme }) => theme.shadow};

  &:hover{
    transform:translateY(-4px);
    box-shadow:${({ theme }) => theme.shadowHover};
  }

  .ant-card-body{
    padding:16px !important;
  }

  .ant-typography{
    color:${({ theme }) => theme.text} !important;
    font-weight:600;
  }

  p{
    color:${({ theme }) => theme.textSecondary} !important;
    margin-bottom:6px;
    font-size:13px;
  }
`;

const AnimatedWrapper = styled.div`

    width:100%;
    min-width:0;
    display:contents;

    animation: fadeUp .5s ease forwards;
    opacity:0;

    @keyframes fadeUp{
        from{
            transform:translateY(20px);
            opacity:0;
        }
        to{
            transform:translateY(0);
            opacity:1;
        }
    }
`;

function Home() {

    const { styles } = useButtonStyles();

    const [open, setOpen] = useState(false);

    const [search, setSearch] = useState("");

    const { data: rooms = [], isLoading } = useQuery({
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

    if (isLoading) {
        return (
            <StyledDiv>
                {[...Array(6)].map((_, i) => (
                    <Card key={i} style={{ height: 180, borderRadius: 18 }}>
                        <Spin />
                    </Card>
                ))}
            </StyledDiv>
        )
    }

    return (
        <div style={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
        }}>
            <HeaderBar style={{ flexShrink: 0 }}>
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
                        //<AnimatedWrapper style={{ animationDelay: `${index * 0.07}s` }} key={room.id}>
                        <StyledCard key={room.id}
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
                            style={{ minHeight: 140, animationDelay: `${index * 0.07}s` }}
                        >
                            {room.air_conditioning && <p><FontAwesomeIcon icon={faWind} /> Ar Condicionado</p>}
                            {room.crib && <p><FontAwesomeIcon icon={faBabyCarriage} /> Berço</p>}
                            {room.fan && <p> <FontAwesomeIcon icon={faFan} /> Ventilador</p>}
                            {room.guest_capacity && <p><FontAwesomeIcon icon={faPeopleRoof} /> Capacidade Total - {room.guest_capacity} pessoas </p>}
                            {room.double_beds !== 0 && <p><FontAwesomeIcon icon={faBed} /> Camas de casal - {room.double_beds} </p>}
                            {room.single_beds !== 0 && <p><FontAwesomeIcon icon={faBed} /> Camas de solteiro - {room.single_beds} </p>}
                        </StyledCard>
                        //</AnimatedWrapper>
                    )
                }) : []}
            </StyledDiv >

            <BookingDrawer
                open={open}
                onClose={closeDrawer}
            />
        </div>
    );

}

export default Home;