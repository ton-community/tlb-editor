import { createHashRouter, Navigate, RouteObject } from 'react-router-dom';

import App from '@/App';
import { About } from '@/pages/About';
import { Main } from '@/pages/Main';

export const paths = {
    index: '/',
    main: '/main',
    about: '/about',
};

export const routes: RouteObject[] = [
    {
        path: paths.index,
        element: <App />,
        children: [
            {
                path: paths.main,
                element: <Main />,
            },
            { path: paths.about, element: <About /> },
            { path: paths.index, element: <Navigate to={paths.main} /> },
        ],
    },
    { path: '*', element: <Navigate to={paths.main} /> },
];

export const router = createHashRouter(routes);
