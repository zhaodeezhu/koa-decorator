import Koa from 'koa';

import RegisterRouter from './registerRouter';

const server = new Koa();

const router = new RegisterRouter(server);

router.start();

server.listen(2001, () => {
  console.log('2001启动了');
})