import { dataHeap, appState } from '../appState.js';
import { bcOperation } from '../libs/bcLib.js';

export const getEntities = async (ctx) => {
    ctx.body = dataHeap.entities;
};

export const getEntityRecords = async (ctx) => {
    ctx.body = await bcOperation('getEntityRecords', {
        pEntityCode: ctx.params.entityCode,
        pView: ctx.request.body?.view || '',
        pPageSize: appState.pageSize,
        pPageIndex: ctx.params.pageIndex
    });
};

export const getEntityRecord = async (ctx) => {
    ctx.body = await bcOperation('getEntityRecord', {
        pEntityCode: ctx.params.entityCode,
        pKeyFieldsView: ctx.request.body?.keyFieldsView || ''
    });
};

export const entityAmend = async (ctx) => {
    ctx.body = await bcOperation('EntityAmend', {
        pEntityCode: ctx.params.entityCode,
        pAmendType: ctx.params.amendType,
        pRecord: JSON.stringify(ctx.request.body?.record) || '',
    });
};

export const initApp = async () => {
    console.log('Init Started.');
    dataHeap.entities = await bcOperation('GetEntities', {})
        .then((response) => {
            appState.initComplete = true
            return response;
        });
}