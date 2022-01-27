/*
 * @Author: your name
 * @Date: 2022-01-27 17:42:20
 * @LastEditTime: 2022-01-27 18:15:03
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \Coders\src\middleWare\auth.js
 */
module.exports = options => {
  const inspirecloud = require("@byteinspire/api");
  return async(req, res, next) => {
    const user = await inspirecloud.user.current(req);
    if (!user) {
      res.status(401);
      res.send({
        success: false,
        message: '用户未登录'
      });
      return;
    }
    await next();
  }
}