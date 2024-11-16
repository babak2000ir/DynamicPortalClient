import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { loadEntities, loadRecords, loadRecord } from './services/entitySvc';
import { loadPages } from './services/codeSvc';
import { isNumeric } from './helpers';

export const useGlobalStore = create(devtools(set => ({
    //UI
    showSidebar: true,
    setShowSidebar: (showSidebar) => set({ showSidebar }),
    selectedPage: null,
    setSelectedPage: (selectedPage) => set({ selectedPage }),

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

}), 'globalStore'));

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
    rowIndex: 0,
    setRowIndex: (rowIndex) => set({ rowIndex }),
    pageIndex: 1,
    setPageIndex: (pageIndex) => set({ pageIndex }),
    quickEdit: false,
    setQuickEdit: (quickEdit) => set({ quickEdit }),
    quickAdd: false,
    setQuickAdd: (quickAdd) => set({ quickAdd }),

}), 'listPageStore');

export const cardPageStore = devtools((set, get) => ({
    recordLoading: false,
    record: [],
    loadRecord: () => loadRecord(set),
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