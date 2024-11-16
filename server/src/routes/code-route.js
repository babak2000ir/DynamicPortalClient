import Router from 'koa-router';
import { getPages } from '../services/codeSvc.js';

const router = new Router();

router.get('/getPages', getPages);

export default router;
