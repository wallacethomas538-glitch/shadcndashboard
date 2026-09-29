// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { lazy } from 'react';
import { Navigate, createBrowserRouter } from 'react-router';
import Loadable from '../layouts/full/shared/loadable/Loadable';

const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));
const ModernDashboard = Loadable(lazy(() => import('../views/dashboards/modern')));
const Workspace = Loadable(lazy(() => import('../views/vektorflow/workspace')));
const AgentsPage = Loadable(lazy(() => import("../views/vektorflow/agents")));
const ModelsPage = Loadable(lazy(() => import("../views/vektorflow/models")));
const HermesPage = Loadable(lazy(() => import("../views/vektorflow/hermes")));
const Error = Loadable(lazy(() => import('../views/auth/error')));

const auth = {
  login: Loadable(lazy(() => import('../views/auth/auth2/login'))),
  register: Loadable(lazy(() => import('../views/auth/auth2/register'))),
  forgot: Loadable(lazy(() => import('../views/auth/auth2/forgot-password'))),
  reset: Loadable(lazy(() => import('../views/auth/auth2/reset-password'))),
  two: Loadable(lazy(() => import('../views/auth/auth2/two-steps'))),
  maintenance: Loadable(lazy(() => import('../views/auth/maintenance'))),
};

const Router: import("react-router").RouteObject[] = [
  { path: '/', element: <FullLayout />, children: [
    { path: '/', element: <ModernDashboard /> },
    { path: '/dashboards/modern', element: <ModernDashboard /> },
    { path: '/vektorflow/agents', element: <AgentsPage /> },
    { path: '/vektorflow/agents/:agentName', element: <AgentsPage /> },
    { path: '/vektorflow/models', element: <ModelsPage /> },
    { path: '/vektorflow/hermes', element: <HermesPage /> },
    { path: '/vektorflow/products', element: <Workspace /> },
    { path: '/vektorflow/inventory', element: <Workspace /> },
    { path: '/vektorflow/sales', element: <Workspace /> },
    { path: '/vektorflow/marketing', element: <Workspace /> },
    { path: '/vektorflow/content', element: <Workspace /> },
    { path: '/vektorflow/trends', element: <Workspace /> },
    { path: '/vektorflow/competition', element: <Workspace /> },
    { path: '/vektorflow/finance', element: <Workspace /> },
    { path: '/vektorflow/stores', element: <Workspace /> },
    { path: '/vektorflow/experiments', element: <Workspace /> },
    { path: '/vektorflow/knowledge', element: <Workspace /> },
    { path: '/vektorflow/security', element: <Workspace /> },
    { path: '/vektorflow/governance', element: <Workspace /> },
    { path: '/vektorflow/oracle', element: <Workspace /> },
    { path: '/vektorflow/integrations', element: <Workspace /> },
    { path: '/vektorflow/settings', element: <Workspace /> },
    { path: '*', element: <Navigate to="/auth/404" /> },
  ]},
  { path: '/', element: <BlankLayout />, children: [
    { path: '/auth/auth2/login', element: <auth.login /> },
    { path: '/auth/auth2/register', element: <auth.register /> },
    { path: '/auth/auth2/forgot-password', element: <auth.forgot /> },
    { path: '/auth/auth2/reset-password', element: <auth.reset /> },
    { path: '/auth/auth2/two-steps', element: <auth.two /> },
    { path: '/auth/maintenance', element: <auth.maintenance /> },
    { path: '/auth/404', element: <Error /> },
  ]},
];
export default createBrowserRouter(Router);
