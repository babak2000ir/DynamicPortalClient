import path from 'node:path';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';
import { __dirname } from './config.js';
import router from './routes/apiRoutes.js';
import logger from './middlewares/logger.js';
import responseTime from './middlewares/responseTime.js';
import requestLogger from './middlewares/requestLogger.js';
import ratelimit from 'koa-ratelimit';
import helmet from 'koa-helmet';
import { initApp, appState } from './services/businessCentralService.js';


const app = new Koa();
const port = process.env.port || 8080;

// Rate limiting middleware
app.use(ratelimit({
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

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://trusted.cdn.com"],
      styleSrc: ["'self'", "https://trusted.cdn.com"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https://trusted.cdn.com"],
      objectSrc: ["'none'"],
      frameSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  }
}));

app.use(helmet());
app.use(helmet.contentSecurityPolicy());
app.use(helmet.noSniff());
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.xssFilter());

app.use(bodyParser());
app.use(logger);
app.use(responseTime);
app.use(requestLogger);
app.use(router.routes());
app.use(router.allowedMethods());

if (process.env.NODE_ENV === 'development') {
  app.use(serve(path.join(__dirname, '../../client/build')));
  app.use(serve(path.join(__dirname, '../../client/public')));
} else {
  app.use(serve(path.join(__dirname, '../../dist/client')));
}



initApp()
  .then(() => {
    appState.initComplete = true;
    console.log('Init Completed.');
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(`Initialization error: ${error}`);
  });

console.log(`Server is running`);

