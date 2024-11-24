import { fetchCall } from './fetchSvc';
import { getEntityCode, getRecordKeyValueArray, getRecordKeyView } from '../stores';

export const loadEntities = async (set) => {
    try {
        set({ entitiesLoading: true });
        const { entities } = await fetchCall('/entity/getEntities')
        set({
            entities,
            entitiesLoading: false
        });
    }
    catch (error) {
        set({ entitiesLoading: false });
        return error;
    }
}

export const loadRecords = async (set, get) => {
    try {
        set({ recordsLoading: true });
        const response = await fetchCall(`/entity/getEntityRecords/${getEntityCode(get())}/${get().paging.pageIndex || 1}`,
            { view: get().view },
            'POST');
        set({
            records: [...response.data.records],
            paging: response.data.paging,
            returnedEntityCode: response.data.entityCode,
            recordsLoading: false
        });
    }
    catch (error) {
        set({ recordsLoading: false });
        return error;
    }
}

export const loadRecord = async (set, get) => {
    try {
        set({ recordLoading: true });
        const response = await fetchCall(
            `/entity/getEntityRecord/${getEntityCode(get())}`,
            { keyFieldsView: getRecordKeyView(get()) },
            'POST');
        set({
            record: response.data.record,
            returnedEntityCode: response.data.entityCode,
            recordLoading: false
        });
    }
    catch (error) {
        set({ recordLoading: false });
        return error;
    }
}

export const amendEntity = async (set, get, amendType) => {
    const entityCode = getEntityCode(get());
    try {
        await fetchCall(
            `/entity/entityAmend/${entityCode}/${amendType}`,
            { record: getRecordKeyValueArray(get()) },
            'POST'
        );
        set({ records: [...get().records.filter(r => r !== get().selectedRecord)] });
    } catch (error) {
        return error;
    }
}