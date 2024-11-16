import Router from 'koa-router';
import ratelimit from 'koa-ratelimit';
import adminRouter from './admin-route.js';
import authRouter from './auth-route.js';
import codeRouter from './code-route.js';
import entityRouter from './entity-route.js';

function createErrorResponse(error) {
    let code = 500;
    let message = 'Internal Server Error';

    if (error.response?.data.error.code && error.response?.data.error.message) {
        code = error.response?.data.error.code;
        message = error.response?.data.error.message;
    }
    else if (error.response?.data.error) {
        code = error.response?.status;
        message = error.response?.data.error;
    }
    else if (error.code && error.message) {
        code = error.code;
        message = error.message;
    }
    else if (error.message) {
        message = error.message;
    }

    return { code, message };
}

export function routeHandler(func) {
    return async (ctx) => {
        try {
            ctx.type = 'application/json';
            await func(ctx);
        }
        catch (error) {
            ctx.status = error.response?.status || 500;
            ctx.type = 'application/json';
            ctx.body = createErrorResponse(error);
        }
    }
}

const router = new Router();

router.use(ratelimit({
    driver: 'memory',
    db: new Map(),
    duration: 60000, // 1 minute
    errorMessage: { error: 'Slow down your requests.' },
    id: (ctx) => ctx.ip, // Identify the client by IP address
    headers: {
        remaining: 'Rate-Limit-Remaining',
        reset: 'Rate-Limit-Reset',
        total: 'Rate-Limit-Total'
    },
    max: 100, // Limit each IP to 100 requests per duration
    disableHeader: false,
}));

router.use('/auth', authRouter.routes());
router.use('/code', codeRouter.routes());
router.use('/entity', entityRouter.routes());
router.use('/admin', adminRouter.routes());

export default router;
