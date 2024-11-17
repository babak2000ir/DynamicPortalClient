import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { loadEntities, loadRecords, loadRecord } from './services/entitySvc';
import { loadPages } from './services/codeSvc';
import { isNumeric } from './helpers';

export const useGlobalStore = create(devtools(set => ({
    //UI
    showSidebar: true,
    setShowSidebar: (showSidebar) => set({ showSidebar }),

    //Global Data
    entitiesLoading: false,
    entities: [],
    loadEntities: () => loadEntities(set),
    pages: [],
    loadPages: () => loadPages(set),

    //Application State
    alerts: [],
    setAlert: (newAlert) => set((state) => ({ alerts: [...state.alerts, newAlert] })),
    supressAlert: (alertId) => set((state) => ({ alerts: state.alerts.map((alert) => alert.id === alertId ? { ...alert, supressed: true } : alert) })),
    removeAlert: (alertId) => set((state) => ({ alerts: state.alerts.filter((alert) => alert.id !== alertId) })),

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
    loadRecords: (entityCode, view) => loadRecords(set, get, entityCode, view),

    //Page State
    selectedRecord: [],
    selectedRecordKey: '',
    setSelectedRecordKey: (selectedRecord) => {
        set({ selectedRecord });

        let keyFieldsValue = '';
        const entity = useGlobalStore.getState().entities.find(e => e.entityCode === get().actualEntityCode);
        if (entity) {
            entity.fields.filter(f => f.partOfPrimaryKey).forEach(f => {
                if (!keyFieldsValue) 
                    keyFieldsValue = `where(${f.id}=const(${selectedRecord[entity.fields.indexOf(f)]}`
                else
                    keyFieldsValue += `,${f.id}=const(${selectedRecord[entity.fields.indexOf(f)]}`;
            });
            keyFieldsValue += ')';
        }

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