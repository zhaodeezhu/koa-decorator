import RouterApp from 'koa-router';

import { baseList, routerList } from './decorator';

import path from 'path';
import fs from 'fs';

const router = new RouterApp();

export default class RegisterRouter {
  server
  constructor(server) {
    this.server = server;
    // 读取router下的所有文件
    this.readRouterFile(path.join(process.cwd(), './router'));
  }

  start() {
    baseList.forEach(item => {
      const { basePath, OriginClass } = item;

      // 将我们接受到的类实例化
      const BaseRouter = new OriginClass();

      // 要找到当前的类在去注册路由 关键代码，OriginClass.prototype === route.target 上面有提到
      routerList
      .filter(route => OriginClass.prototype === route.target)
      .forEach(route => {
        let url: any;
        if (route.path instanceof RegExp) {
          url = route.path
        } else {
          console.log(basePath);
          console.log(route.path);
          url = path.join(basePath, route.path);
          url = url.replace(/\\/g, '/');
        }
        router[route.method](url, async (ctx, next) => {
          // 关键改动在这里
          function ControllerPrototype() { this.ctx = null; this.next = null }
          ControllerPrototype.prototype = BaseRouter;
          const Controller = new ControllerPrototype();
          Controller.ctx = ctx;
          Controller.next = next;
          const res = await BaseRouter[route.key].call(Controller, ctx, next);
          // 关键改动到这里结束
          if(res) {
            ctx.body = res
          }
        })
      })
    })

    this.server.use(router.routes());
    this.server.use(router.allowedMethods());
  }

  /**
   * 比较关键的一步
   * 要去动态读取router目录下的所有文件
   * 如果不读取，装饰器是获取不到值的
   */
  readRouterFile(dirPath) {
    const filePathMap: { [key: string]: string } = {};

    const isExists = fs.existsSync(dirPath);
    if (!isExists) return {}

    // 先递归读取到所有的目录
    function getFilePath(nd: string = '', frontFileName: string = '') {
      const isExists = fs.existsSync(nd);
      if(!isExists) return;
      fs.readdirSync(nd).forEach(p => {
        console.log(fs.statSync(path.join(nd, p)).isDirectory());
        if (fs.statSync(path.join(nd, p)).isDirectory()) {
          getFilePath(path.join(nd, p), path.join(nd, p))
        } else {
          const f = p.split('.') || '';
          console.log(f[0]);
          const key = path.join(frontFileName, f[0]);
          filePathMap[key] = path.join(nd, p);
        }
      })
    }

    getFilePath(dirPath, '');

    // 读取内容
    const sourceMap: { [key: string]: any } = {};
    Object.keys(filePathMap).forEach(p => {
      if(!p) return;
      console.log(filePathMap[p]);
      let Ob = require(filePathMap[p]);
      if (Ob['default']) {
        Ob = Ob['default'];
      }
      sourceMap[p] = Ob;
    });

    return sourceMap;
  }
}