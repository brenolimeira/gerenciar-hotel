import Home from "./pages/Home";
import { Routes as ReactRouterRoutes, Route } from 'react-router-dom';
import Room from "./pages/Room";

function Routes(props) {
    return (
        <ReactRouterRoutes>
            <Route path="/" element={<Home/>} />
            <Route path="room/:number" element={<Room />} />
        </ReactRouterRoutes>
    );
}

export default Routes;