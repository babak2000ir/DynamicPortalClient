import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { loadEntitiesAndTables, loadEntity } from './services/entitySvc';
import { loadUser } from './services/authSvc';
import { isNumeric } from './helpers';

export const useGlobalStore = create(devtools((set) => ({
    showSidebar: true,
    rowIndex: 0,
    pageIndex: 1,
    showModal: false,
    modalParams: {},
    entities: null,
    user: {},
    error: '',
    loadedPage: 'Dashboard',
    loadedPageParams: {},
    loading: false,
    relatedTableLoading: false,
    recordRelationsLoading: false,
    alerts: [],
    quickEdit: false,
    reload: false,
    quickAdd: false,
    authenticated: false,
    setRowIndex: (rowIndex) => set({ rowIndex }),
    setPageIndex: (pageIndex) => set({ pageIndex }),
    setShowSidebar: (showSidebar) => set({ showSidebar }),
    setShowModal: (showModal, params) => set({ showModal: showModal, modalParams: params }),
    loadUser: async () => loadUser(),
    loadEntitiesAndTables: async () => loadEntitiesAndTables(set),
    setError: (error) => set({ error }),
    clearError: () => set({ error: '' }),
    loadPage: (page, params) => set({ loadedPage: page, loadedPageParams: params }),
    setLoading: (loading) => set({ loading }),
    setRelatedTableLoading: (relatedTableLoading) => set({ relatedTableLoading }),
    setRecordRelationsLoading: (recordRelationsLoading) => set({ recordRelationsLoading }),
    setAlert: (newAlert) => set((state) => ({ alerts: [...state.alerts, newAlert] })),
    removeAlert: (alertId) => set((state) => ({ alerts: state.alerts.filter((alert) => alert.id !== alertId) })),
    setQuickEdit: (quickEdit) => set({ quickEdit }),
    setReload: (reload) => set({ reload }),
    setQuickAdd: (quickAdd) => set({ quickAdd }),
    setAuthenticated: (authenticated) => set({ authenticated }),
    setUser: (user) => set({ user }),
}), 'globalStore'));


export const usePageStore = create(devtools((set, get) => ({
    record: null,
    relatedTableRecord: null,
    showCard: false,
    showRelatedTable: false,
    updateDisabled: true,
    relatedTableUpdateDisabled: true,
    insertFormValid: false,
    entityCollection: {},
    cardParams: {},
    relatedTableParams: {},
    searchError: '',
    setUpdateDisabled: (updateDisabled) => set({ updateDisabled }),
    setRelatedTableUpdateDisabled: (relatedTableUpdateDisabled) => set({ relatedTableUpdateDisabled }),
    setShowCard: (showCard, record, cardParams) => set({ showCard, record, cardParams }),
    loadEntity: async (selectedEntityCode, pageIndex = 1, filterObject = [], relatedEntityCode = '') => loadEntity(set, get, selectedEntityCode, pageIndex, filterObject, relatedEntityCode),
    setRecord: (record) => set({ record }),
    setRelatedTableRecord: (relatedTableRecord) => set({ relatedTableRecord }),
    setShowRelatedTable: (showRelatedTable, relatedTableParams) => set({ showRelatedTable, relatedTableParams }),
    setSearchError: (searchError) => set({ searchError }),
    setInsertFormValid: (insertFormValid) => set({ insertFormValid }),
}), 'pageStore'));

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
window.usePageStore = usePageStore;