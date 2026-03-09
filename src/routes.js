import Home from "./pages/Home";
import { Routes as ReactRouterRoutes, Route } from 'react-router-dom';
import Room from "./pages/Room";
import ManagerRooms from "./pages/ManagerRooms";
import Guests from "./pages/Guests";
import Reservations from "./pages/ReservationsHistoric";
import RegisterUser from "./pages/RegisterUser";
import Login from "./pages/Login";
import PrivateRoute from "./auth/PrivateRoute";


function Routes(props) {
    return (
        <ReactRouterRoutes>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<RegisterUser />} />

            <Route element={<PrivateRoute />}>
                <Route path="/" element={<Home/>} />
                <Route path="room/:number" element={<Room />} />
                <Route path="/room/edit" element={<ManagerRooms />} />
                <Route path="/guests" element={<Guests />} />
                <Route path="/booking/historic" element={<Reservations />} />
            </Route>
        </ReactRouterRoutes>
    );
}

export default Routes;