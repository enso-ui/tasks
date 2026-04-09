import App from '@enso-ui/ui/src/core/app';
import Tasks from './components/navbar/Tasks.vue';

export default () => App.registerNavbarItem('tasks', Tasks, 150, 'tasks.count');
