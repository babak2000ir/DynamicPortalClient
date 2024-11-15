import { dataHeap, appState } from '../appState.js';
import { bcOperation } from '../libs/bcLib.js';

export const getEntities = async (ctx) => {
    ctx.body = dataHeap.entities;
};

export const getEntityRecords = async (ctx) => {
    ctx.body = await bcOperation('getEntityRecords', {
        pEntityCode: ctx.params.entityCode,
        pView: ctx.params.view,
        pPageSzie: appState.pageSize,
        pPageIndex: ctx.params.pageIndex
    });
};

export const getEntityRecord = async (ctx) => {
    ctx.body = await routeHandler('EntityData', {
        pEntityCode: ctx.params.entityCode,
        pKeyFieldsValue: ctx.params.keyFieldsValue
    });
};

export const entityAmend = async (ctx) => {
    ctx.body = await routeHandler('EntityDataAmend', {
        pEntityCode: ctx.params.entityCode,
        pAmendType: ctx.params.amendType,
        pRecord: ctx.request.body
    });
};

export const initApp = async () => {
    console.log('Init Started.');
    dataHeap.entities = await bcOperation('GetEntities', {})
        .then(() =>
            appState.initComplete = true
        );
}