import Koa from 'koa'; 
import { getLogger } from './core/logging';

const app = new Koa();

app.use(async (ctx) => {
  ctx.body = 'Hello World from TypeScript';
});

app.listen(9000, () => {
    getLogger().info('🚀 Server listening on http://127.0.0.1:9000');
  });
