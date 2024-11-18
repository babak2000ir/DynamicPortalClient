import { fetchCall } from './fetchSvc';

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

export const loadRecords = async (set, get, entityCode, view) => {
    try {
        set({ recordsLoading: true });
        const response = await fetchCall(`/entity/getEntityRecords/${entityCode}/${view}/${get().pageIndex || 1}`,
            { view },
            'POST');
        set({
            records: [...response.data.records],
            paging: response.data.paging,
            actualEntityCode: response.data.entityCode,
            recordsLoading: false 
        });
    }
    catch (error) {
        set({ recordsLoading: false });
        return error;
    }
}

export const loadRecord = async (set, entityCode, keyFieldsValue) => {
    try {
        set({ recordLoading: true });
        const response = await fetchCall(`/entity/getEntityRecord/${entityCode}/${keyFieldsValue}`);
        set({
            record: response.data.record,
            actualEntityCode: response.data.entityCode,
            recordLoading: false
        });
    }
    catch (error) {
        set({ recordLoading: false });
        return error;
    }
}
//TODO - replace actualEntityCode with proper selector from useGlobalStore
export const amendEntity = async (set, get, amendType) => {
    try {
        await fetchCall(
            `/entity/entityAmend/${get().actualEntityCode}/${amendType}`,
            { record: JSON.stringify(get().selectedRecordKeyValueArray) },
            'POST'
        );
        set({ records: [...get().records.filter(r => r !== get().selectedRecord)] });
    } catch (error) {
        return error;
    }
}