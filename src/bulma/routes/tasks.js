import routeImporter from '@enso-ui/ui/src/modules/importers/routeImporter';

const routes = routeImporter.fromGlob(import.meta.glob('./tasks/*.js', { eager: true }));
const RouterView = () => import('@enso-ui/ui/src/bulma/pages/Router.vue');

export default {
    path: '/tasks',
    component: RouterView,
    meta: {
        breadcrumb: 'tasks',
        route: 'tasks.index',
    },
    children: routes,
};
