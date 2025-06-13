import { createHashRouter } from "react-router-dom";

import DayViewPage from "../pages/DayViewPage";
import App from "../App";
 
import { MAIN_ROUTE, DAYVIEW_ROUTE } from "../consts/routePaths";
import Dashboard from "../components/Dashboard/Dashboard";

export const router = createHashRouter([
    {
        path: MAIN_ROUTE, 
        element: <App />,
        children: [
            {
                path: MAIN_ROUTE,
                element: <Dashboard />
            },
            {
                path: DAYVIEW_ROUTE,
                element: <DayViewPage />
            }
        ]
    },
    {
        path: "*",
        element: <div>404</div>
    }
])