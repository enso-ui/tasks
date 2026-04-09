import { getActivePinia } from 'pinia';

export const useStore = (id) => {
    const pinia = getActivePinia();

    return pinia._s.get(id);
};
