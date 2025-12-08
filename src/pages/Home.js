import { Card, Flex, Typography } from 'antd';

import rooms from '../mock/quartos.json'
import { NavLink } from 'react-router-dom';

function Home() {

    return (
        <Flex gap={16}>
            {rooms.map((room, index) => {
                return(    
                    <NavLink 
                        key={index} 
                        to={`/room/${room.numero}`}
                        style={{ textDecoration: "none" }}
                    >
                        <Card key={index} 
                            title={<Typography.Title 
                            level={3}>Quarto {room.numero}</Typography.Title>} 
                            variant="borderless" 
                            style={{ width: 300, backgroundColor: room.ocupado ? "#A30000" : '#0A7500' }}
                        >
                            <p>Hospedes : {room.quantidade_pessoas}</p>
                        </Card>
                    </NavLink>
                )
            })}
        </Flex>
    );

}

export default Home;