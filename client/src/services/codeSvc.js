import { useGlobalStore } from '../stores';
import { fetchCall } from './fetchSvc';

export const loadPages = async (set) => {
    try {
        set({ pages: [...await fetchCall('/code/getPages')] });
    }
    catch (error) {
        useGlobalStore.getState().setAlert({ type: 'error', message: (error.code && `${error.code}: ` + error.message) || JSON.stringify(error) });
    }
}