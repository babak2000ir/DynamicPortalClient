import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { loadEntities, loadRecords, loadRecord, amendEntity } from './services/entitySvc';
import { loadPages } from './services/codeSvc';
import { isNumeric } from './helpers';

export const PageMode = {
    View: 0,
    Edit: 1,
    New: 2
};

export const useGlobalStore = create(devtools((set, get) => ({
    //Global Store//
    //UI
    showSidebar: true,
    setShowSidebar: (showSidebar) => set({ showSidebar }),

    //Global Data
    entitiesLoading: false,
    entities: [],
    loadEntities: async () => loadEntities(set),
    pages: [],
    loadPages: async () => loadPages(set),

    //Page Stack
    selectedPage: null,
    setSelectedPage: (selectedPage) => set({ selectedPage }),
    view: '',
    setView: (view) => set({ view }),

    //List Page Store//
    //Entity
    recordsLoading: false,
    records: [],
    returnedEntityCode: '',
    paging: {
        pageIndex: 1,
        pageCount: 0,
        pageSize: 10
    },
    setPageIndex: (pageIndex) => set({ paging: { ...get().paging, pageIndex } }),
    loadRecords: async () => loadRecords(set, get),
    deleteSelectedRecord: async () => amendEntity(set, get, 'delete'),

    //Page State
    selectedRecord: [],
    setSelectedRecord: (selectedRecord) => set({ selectedRecord }),
    pageMode: PageMode.View,
    setPageMode: (pageMode) => set({ pageMode }),

    //Card Page Store//
    //UI
    numberOfColumns: 2,

    recordLoading: false,
    record: [],
    loadRecord: () => loadRecord(set, get),

}), 'globalStore'));

export const getEntityCode = (state) => 
    state.pages.find(p => p.id === state.selectedPage).entity;

export const getEntity = (state) =>
    state.entities?.filter(e => e.entityCode === getEntityCode(state))?.[0];

export const getRecordKeyView = (state) => {
    if (!state.selectedRecord) return '';
    
    const entity = getEntity(state);

    let keyFieldsValue = '';
    if (entity) {
        entity.fields.filter(f => f.partOfPrimaryKey).forEach(f => {
            if (!keyFieldsValue) {
                keyFieldsValue = `where(${f.id}=const(${state.selectedRecord[entity.fields.indexOf(f)]}`;
            }
            else {
                keyFieldsValue += `,${f.id}=const(${state.selectedRecord[entity.fields.indexOf(f)]}`;
            }
        });
        keyFieldsValue += '))';
    }
    return keyFieldsValue;
}

export const getRecordKeyValueArray = (state) => {
    const entity = getEntity(state);
    let keyFieldsValueArray = [];
    if (entity) {
        entity.fields.filter(f => f.partOfPrimaryKey).forEach(f => {
            keyFieldsValueArray.push({ id: f.id, value: state.selectedRecord[entity.fields.indexOf(f)] });
        });
    }
    return keyFieldsValueArray;
}

//

export const selectRelatedEntityCode = (selectedEntityCode) => {
    return state => isNumeric(selectedEntityCode) ?
        state.entities?.filter(t => t.id === selectedEntityCode)?.[0]?.entityCode :
        state.entities?.filter(e => e.entityCode === selectedEntityCode)?.[0]?.entityCode;
}

export const selectRelations = (selectedEntityCode) => {
    return state => isNumeric(selectedEntityCode) ?
        state.entities?.filter(t => t.id === selectedEntityCode)?.[0]?.relations :
        state.entities?.filter(e => e.entityCode === selectedEntityCode)?.[0]?.relations;
}
//Debug
window.useGlobalStore = useGlobalStore;