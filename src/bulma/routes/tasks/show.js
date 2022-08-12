const Show = () => import('../../pages/tasks/Show.vue');

export default {
    name: 'tasks.show',
    path: ':task',
    component: Show,
    meta: {
        breadcrumb: 'show',
        title: 'Checklist',
    },
};
