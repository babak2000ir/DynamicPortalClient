import { useGlobalStore } from '../stores';
import { fetchCall } from './fetchSvc';

export const loadEntities = async (set) => {
    try {
        set({ entitiesLoading: true });
        const { entities } = await fetchCall('/entity/getEntities')
        set({ entities });
        set({ entitiesLoading: false });
    }
    catch (error) {
        console.log(error);
        useGlobalStore.getState().setAlert({ type: 'error', message: (error.code && `${error.code}: ` + error.message) || JSON.stringify(error) });
    }
}

export const loadRecords = async (set, get, entityCode, view) => {
    try {
        set({ recordsLoading: true });
        const response = await fetchCall(`/entity/getEntityRecords/${entityCode}/${view}/${get.pageIndex || 1}`,{
            view
        }, 'POST');
        set({ 
            records: [...response.data.records],
            paging: response.data.paging,
            actualEntityCode: response.data.entityCode
         });
        set({ recordsLoading: false });
    }
    catch (error) {
        useGlobalStore.getState().setAlert({ type: 'error', message: (error.code && `${error.code}: ` + error.message) || JSON.stringify(error) });
    }
}

export const loadRecord = async (set, entityCode, keyFieldsValue) => {
    try {
        set({ recordLoading: true });
        const response = await fetchCall(`/entity/getEntityRecord/${entityCode}/${keyFieldsValue}`);
        set({ 
            record: response.data.record,
            actualEntityCode: response.data.entityCode
        });
        set({ recordLoading: false });
        
    }
    catch (error) {
        useGlobalStore.getState().setAlert({ type: 'error', message: (error.code && `${error.code}: ` + error.message) || JSON.stringify(error) });
    }
}

export const amendEntity = async (entityCode, record, amendType) => {
    try {
        const response = await fetchCall(
            `/entity/amendEntity/${entityCode}/${amendType}`,
            { record },
            'POST'
        );
        return response;
    } catch (error) {
        useGlobalStore.setState({ error: (error.code && `${error.code}: ` + error.message) || JSON.stringify(error) });
    }
}