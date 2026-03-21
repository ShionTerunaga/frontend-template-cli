import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
    index('routes/home.tsx'),
    route('/server-loader', 'routes/server-loader.tsx'),
    route('/client-loader', 'routes/client-loader.tsx'),
    route('/server-action', 'routes/server-action.tsx'),
] satisfies RouteConfig
