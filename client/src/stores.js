import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { loadEntities, loadRecords, loadRecord, amendEntity } from './services/entitySvc';
import { loadPages } from './services/codeSvc';
import { isNumeric } from './helpers';

export const useGlobalStore = create(devtools((set, get) => ({
    //UI
    showSidebar: true,
    setShowSidebar: (showSidebar) => set({ showSidebar }),

    //Global Data
    entitiesLoading: false,
    entities: [],
    loadEntities: async () => loadEntities(set),
    pages: [],
    loadPages: async () => loadPages(set),

    //Page Stak
    selectedPage: null,
    setSelectedPage: (selectedPage) => set({ selectedPage }),
    view: '',
    setView: (view) => set({ view }),
    keyFieldsValue: '',
    setKeyFieldsValue: (keyFieldsValue) => set({ keyFieldsValue }),

}), 'globalStore'));

export const PageMode = {
    View: 0,
    Edit: 1,
    New: 2
};
//TODO - replace actualEntityCode with proper selector from useGlobalStore
export const listPageStore = devtools((set, get) => ({
    //Entity
    recordsLoading: false,
    records: [],
    actualEntityCode: '',
    paging: {
        pageIndex: 1,
        pageCount: 0,
        pageSize: 10
    },
    loadRecords: async (entityCode, view) => loadRecords(set, get, entityCode, view),
    deleteSelectedRecord: async () => amendEntity(set, get, 'delete'),

    //Page State
    selectedRecord: [],
    selectedRecordKey: '',
    selectedRecordKeyValueArray: '',
    setSelectedRecord: (selectedRecord) => {
        set({ selectedRecord });

        let keyFieldsValue = '';
        let keyFieldsValueArray = [];
        const entity = useGlobalStore.getState().entities.find(e => e.entityCode === get().actualEntityCode);
        if (entity) {
            entity.fields.filter(f => f.partOfPrimaryKey).forEach(f => {
                if (!keyFieldsValue) {
                    keyFieldsValue = `where(${f.id}=const(${selectedRecord[entity.fields.indexOf(f)]}`;
                    keyFieldsValueArray.push({ id: f.id, value: selectedRecord[entity.fields.indexOf(f)] });
                }
                else {
                    keyFieldsValue += `,${f.id}=const(${selectedRecord[entity.fields.indexOf(f)]}`;
                    keyFieldsValueArray.push({ id: f.id, value: selectedRecord[entity.fields.indexOf(f)] });
                }
            });
            keyFieldsValue += ')';
        }

        set({ selectedRecordKeyValueArray: keyFieldsValueArray });
        set({ selectedRecordKey: keyFieldsValue })
    },
    pageIndex: 1,
    setPageIndex: (pageIndex) => set({ pageIndex }),
    pageMode: PageMode.View,
    setPageMode: (pageMode) => set({ pageMode }),

}), 'listPageStore');

export const cardPageStore = devtools((set, get) => ({
    //UI
    numberOfColumns: 2,

    recordLoading: false,
    record: [],
    loadRecord: (entityCode, keyFieldsValue) => loadRecord(set, entityCode, keyFieldsValue),

}), 'cardPageStore');

//Selectors
export const selectFields = (selectedEntityCode) => {
    return state => isNumeric(selectedEntityCode) ?
        state.entities?.filter(t => t.id == selectedEntityCode && t.entityCode === '')?.[0]?.fields :
        state.entities?.filter(e => e.entityCode == selectedEntityCode)?.[0]?.fields;
}

export const selectEntity = (selectedEntityCode) => {
    return state => isNumeric(selectedEntityCode) ?
        state.entities?.filter(t => t.id == selectedEntityCode && t.entityCode === '')?.[0] :
        state.entities?.filter(e => e.entityCode == selectedEntityCode)?.[0];
}

export const selectRelatedEntityCode = (selectedEntityCode) => {
    return state => isNumeric(selectedEntityCode) ?
        state.entities?.filter(t => t.id == selectedEntityCode)?.[0]?.entityCode :
        state.entities?.filter(e => e.entityCode == selectedEntityCode)?.[0]?.entityCode;
}

export const selectRelations = (selectedEntityCode) => {
    return state => isNumeric(selectedEntityCode) ?
        state.entities?.filter(t => t.id == selectedEntityCode)?.[0]?.relations :
        state.entities?.filter(e => e.entityCode == selectedEntityCode)?.[0]?.relations;
}
//Debug
window.useGlobalStore = useGlobalStore;