import Router from 'koa-router';
import { getEntities, getEntityRecords, getEntityRecord, entityAmend } from '../services/entitySvc.js';
import { routeHandler } from './route-manager.js';

const router = new Router();

router.get('/getEntities', routeHandler(getEntities));
router.post('/getEntityRecords/:entityCode/:pageIndex', routeHandler(getEntityRecords));
router.get('/getEntityRecord/:entityCode/:keyFieldsValue', routeHandler(getEntityRecord));
router.post('/entityAmend/:entityCode/:amendType', routeHandler(entityAmend));

export default router;
