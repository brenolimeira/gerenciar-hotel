import Home from "./pages/Home";
import { Routes as ReactRouterRoutes, Route } from 'react-router-dom';
import Room from "./pages/Room";
import ManagerRooms from "./pages/ManagerRooms";

function Routes(props) {
    return (
        <ReactRouterRoutes>
            <Route path="/" element={<Home/>} />
            <Route path="room/:number" element={<Room />} />
            <Route path="/room/edit" element={<ManagerRooms />} />
        </ReactRouterRoutes>
    );
}

export default Routes;