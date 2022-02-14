import { Route, Get, Controller } from '../decorator';


@Route('/api/shop')
export default class Shop extends Controller {
  /**
   * 获取商品接口
   * @param ctx koa的上下文
   * @param next koa的next
   * @return 直接将这个方法的返回值放在ctx.body上
   */
  @Get('/getProduct')
  async getProduct(ctx, next) {
    const url = this.ctx.url;
    // 可以直接通过返回值响应，也可以使用ctx.body
    return {
      status: '0',
      data: '我是商品',
      message: url
    }
  }
}