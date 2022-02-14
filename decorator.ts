
/** 基础类 */
export const baseList = [];

/** 路由 */
export const routerList = [];

/** 装饰路由类 */
export function Route(basePath: string) {
  return (OriginClass) => {
    baseList.push({
      OriginClass,
      basePath
    })
  }
}

export type IMethod = 'post' | 'get' | 'patch' | 'delete' | 'put' | 'head';

export function Method(method: IMethod) {
  return (path: string | RegExp) => (target, key, descriptor) => {
    routerList.push({
      target,
      key,
      path,
      method
    })
  }
}

/** 
 * 创建Get属性装饰器
 * koa-router支持正则，这里提前预留
 */
/** 请求Get方法 */
export const Get = Method('get');

/** 请求Post方法 */
export const Post = Method('post');

/** 请求delete方法 */
export const Delete = Method('delete');

/** 请求Patch方法 */
export const Patch = Method('patch');

/** 请求put方法 */
export const Put = Method('put');

/** 请求head方法 */
export const Head = Method('head');

/** 基础的controller */
export class Controller {
  ctx: any;
  next: any;
}