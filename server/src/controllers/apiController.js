import { routeHandler, dataHeap } from '../services/businessCentralService.js';
import validator from 'validator';

export const login = async (ctx) => {
    const { email, password } = ctx.request.body;

    // Sanitize input
    const sanitizedEmail = validator.trim(validator.escape(email));
    const sanitizedPassword = validator.trim(validator.escape(password));

    // Validate input
    if (!validator.isEmail(sanitizedEmail)) {
        ctx.status = 400;
        ctx.body = { error: 'Invalid email format.' };
        return;
    }

    if (validator.isEmpty(sanitizedPassword)) {
        ctx.status = 400;
        ctx.body = { error: 'Password cannot be empty.' };
        return;
    }

    console.log(`Login user: ${sanitizedEmail}`);
    await routeHandler('LoginUser', {
        "pUserEmail": sanitizedEmail,
        "pPassword": sanitizedPassword,
    }, ctx, 'post');
}

export const loadUser = async (ctx) => {
    console.log(`Login Token: ${ctx.request.body.token}`);
    await routeHandler('LoadUser', {
        "pToken": ctx.request.body.token,
    }, ctx, 'post');
}

export const setPassword = async (ctx) => {
    const { userId, password } = ctx.request.body;

    // Sanitize input
    const sanitizedUserId = validator.trim(validator.escape(userId));
    const sanitizedPassword = validator.trim(validator.escape(password));

    // Validate input
    if (validator.isEmpty(sanitizedUserId)) {
        ctx.status = 400;
        ctx.body = { error: 'User ID cannot be empty.' };
        return;
    }

    // Password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
    if (!passwordRegex.test(sanitizedPassword)) {
        ctx.status = 400;
        ctx.body = { error: 'Password must be at least 7 characters long, include at least one uppercase letter, one number, and one special character.' };
        return;
    }

    console.log('set password');
    await routeHandler('SetPassword', {
        "pUserId": sanitizedUserId,
        "pPassword": sanitizedPassword,
    }, ctx, 'post');
}

export const getTables = async (ctx) => {
    console.log('Get Tables');
    ctx.type = 'application/json';
    ctx.body = dataHeap.tables;
};

export const getEntities = async (ctx) => {
    console.log('Get Entities');
    ctx.type = 'application/json';
    ctx.body = dataHeap.entities;
};

export const getTableData = async (ctx) => {
    console.log(`Table No: ${ctx.params.tableNo}, Page Index: ${ctx.params.pageIndex}`);

    // Construct the route handler data object
    const routeHandlerData = {
        "pTableNo": ctx.params.tableNo,
        "pView": "",
        "pPageIndex": ctx.params.pageIndex,
    }

    // Extract filterParams & relatedEntity code from ctx.query
    let filterParams = [];

    if (ctx.query.filterParams) {
        try {
            filterParams = JSON.parse(decodeURIComponent(ctx.query.filterParams));
        } catch (error) {
            console.error('Error parsing filterParams:', error);
        }
    }

    // Append query parameters to the route handler data object
    if (filterParams) {
        routeHandlerData.pFilterParams = JSON.stringify(filterParams);
    }

    if (ctx.query.relatedEntityCode) {
        routeHandlerData.pRelatedEntityCode = ctx.query.relatedEntityCode;
    } else {
        routeHandlerData.pRelatedEntityCode = '';
    }

    await routeHandler('TableData', routeHandlerData, ctx);
};

export const getEntityData = async (ctx) => {
    console.log(`Entity Code: ${ctx.params.entityCode}, Page Index: ${ctx.params.pageIndex}`);

    // Construct the route handler data object
    const routeHandlerData = {
        "pEntityCode": ctx.params.entityCode,
        "pView": "",
        "pPageIndex": ctx.params.pageIndex,
    }

    // Extract filterParams from ctx.query
    let filterParams = [];
    if (ctx.query.filterParams) {
        try {
            filterParams = JSON.parse(decodeURIComponent(ctx.query.filterParams));
        } catch (error) {
            console.error('Error parsing filterParams:', error);
        }
    }

    // Append query parameters to the route handler data object
    if (filterParams) {
        routeHandlerData.pFilterParams = JSON.stringify(filterParams);
    }

    if (ctx.query.relatedEntityCode) {
        routeHandlerData.pRelatedEntityCode = ctx.query.relatedEntityCode;
    } else {
        routeHandlerData.pRelatedEntityCode = '';
    }

    await routeHandler('EntityData', routeHandlerData, ctx);
};

export const amendTableData = async (ctx) => {
    console.log(`Table No: ${ctx.params.tableNo}, Amend Type: ${ctx.params.amendType}`);
    await routeHandler('TableDataAmend', {
        "pTableNo": ctx.params.tableNo,
        "pAmendType": ctx.params.amendType,
        "pRecord": JSON.stringify(ctx.request.body.record),
        "pIDFilterString": ctx.request.body.idFilterString,
    }, ctx, 'post');
};

export const amendEntityData = async (ctx) => {
    console.log(`Entity Code: ${ctx.params.entityCode}, Amend Type: ${ctx.params.amendType}`);
    await routeHandler('EntityDataAmend', {
        "pEntityCode": ctx.params.entityCode,
        "pAmendType": ctx.params.amendType,
        "pRecord": JSON.stringify(ctx.request.body.record),
        "pIDFilterString": ctx.request.body.idFilterString,
    }, ctx, 'post');
};

export const searchTableData = async (ctx) => {
    const { tableNo } = ctx.params;
    const { searchTerm } = ctx.request.body;

    console.log(`Entity Code: ${tableNo}, Search Term: ${searchTerm}`);

    await routeHandler('TableDataSearch', {
        "pTableNo": tableNo,
        "pSearchTerm": searchTerm,
    }, ctx, 'post');
};

export const searchEntityData = async (ctx) => {
    const { entityCode } = ctx.params;
    const { searchTerm } = ctx.request.body;

    console.log(`Entity Code: ${entityCode}, Search Term: ${searchTerm}`);

    await routeHandler('EntityDataSearch', {
        "pEntityCode": entityCode,
        "pSearchTerm": searchTerm,
    }, ctx, 'post');
};
