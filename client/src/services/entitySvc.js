import { useGlobalStore, usePageStore } from '../stores';
import { fetchCall } from './fetchSvc';
import { isNumeric } from '../helpers';

export const loadEntitiesAndTables = async (set) => {
    try {
        const { entities } = await fetchCall('/getEntities');
        const { tables } = await fetchCall('/getTables');
        useGlobalStore.setState({ error: '' });
        set({ entities: [...entities, ...tables] });
    }
    catch (error) {
        useGlobalStore.setState({ error: (error.code && `${error.code}: ` + error.message) || JSON.stringify(error) });
    }
}

export const loadEntity = async (set, get, entityCode, pageIndex = 1, filterParams = [], relatedEntityCode = '') => {
    try {
        const queryString = filterParams.length > 0 ? `?filterParams=${encodeURIComponent(JSON.stringify(filterParams))}&relatedEntityCode=${relatedEntityCode}` : '';
        const response = await fetchCall(`/${isNumeric(entityCode) ? 'getTableData' : 'getEntityData'}/${entityCode}/${pageIndex || 1}${queryString ? queryString : ''}`);
        const entity = { ...response.data, entityCode };
        useGlobalStore.setState({ error: '' });
        set({ entityCollection: { ...get().entityCollection, [entityCode]: entity } });
        return entity;
    }
    catch (error) {
        useGlobalStore.setState({ error: (error.code && `${error.code}: ` + error.message) || JSON.stringify(error) });
    }
}

export const amendEntity = async (entityCode, record, amendType, idFilterString = '') => {
    try {
        const response = await fetchCall(
            `/${isNumeric(entityCode) ? 'amendTableData' : 'amendEntityData'}/${entityCode}/${amendType}`,
            { record, idFilterString },
            'POST'
        );
        return response;
    } catch (error) {
        useGlobalStore.setState({ error: (error.code && `${error.code}: ` + error.message) || JSON.stringify(error) });
    }
}

export const searchRelatedTableRecord = async (entityCode, searchTerm = '') => {
    try {
        const response = await fetchCall(
            `/${isNumeric(entityCode) ? 'searchTableData' : 'searchEntityData'}/${entityCode}`,
            { searchTerm },
            'POST'
        );
        return response;
    } catch (error) {
        useGlobalStore.setState({ error: (error.code && `${error.code}: ` + error.message) || JSON.stringify(error) });
    }
}