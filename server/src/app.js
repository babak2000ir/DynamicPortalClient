import path from 'node:path';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';
import { __dirname } from './config.js';
import router from './routes/route-manager.js';
import logger from './middlewares/logger.js';
import responseTime from './middlewares/responseTime.js';
import requestLogger from './middlewares/requestLogger.js';
import helmet from 'koa-helmet';
import { initApp } from './services/entitySvc.js';

const app = new Koa();
const port = process.env.port || 8080;

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
    console.log('Init Completed.');
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.log(`Initialization error: ${error}`);
  });
