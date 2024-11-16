import Router from 'koa-router';
import { refreshEntities } from '../services/adminSvc.js';
import { routeHandler } from '../routes/route-manager.js';

const router = new Router();

router.get('/refreshEntities', routeHandler(refreshEntities));

export default router;
