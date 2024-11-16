import Router from 'koa-router';
import ratelimit from 'koa-ratelimit';
import { login, loadUser, setPassword } from '../services/authSvc.js';

const router = new Router();

const loginRateLimiter = ratelimit({
    driver: 'memory',
    db: new Map(),
    duration: 15 * 60 * 1000, // 15 minutes
    errorMessage: { error: 'Too many attempts, please try again after 15 minutes' },
    id: (ctx) => ctx.ip,
    headers: {
        remaining: 'Rate-Limit-Remaining',
        reset: 'Rate-Limit-Reset',
        total: 'Rate-Limit-Total'
    },
    max: 5 // Limit each IP to 5 login requests per duration
});

router.post('/login', loginRateLimiter, login);
router.post('/loadUser', loadUser);
router.post('/setPassword', loginRateLimiter, setPassword);

export default router;
