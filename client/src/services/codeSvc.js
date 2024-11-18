import { fetchCall } from './fetchSvc';

export const loadPages = async (set) => {
    try {
        set({ pages: [...await fetchCall('/code/getPages')] });
    }
    catch (error) {
        return error;
    }
}