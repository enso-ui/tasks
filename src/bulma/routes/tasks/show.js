const TaskShow = () => import('../../../../src/bulma/pages/tasks/Show.vue');

export default {
    name: 'tasks.show',
    path: ':task',
    component: TaskShow,
    meta: {
        breadcrumb: 'show',
        title: 'Show Task',
    },
};
