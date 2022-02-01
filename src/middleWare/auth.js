/*
 * @Author: your name
 * @Date: 2022-01-27 17:42:20
 * @LastEditTime: 2022-01-28 16:10:59
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \iNote_BE\src\middleWare\auth.js
 */
module.exports = (options) => {
  const inspirecloud = require("@byteinspire/inspirecloud-api");
  return async (req, res, next) => {
    const user = await inspirecloud.user.current(req);
    if (!user) {
      res.status(401);
      res.send({
        success: false,
        message: "用户未登录",
      });
      return;
    }
    // 通过中间件查询将当前用户id储存在req.author中
    req.author = user._id;
    await next();
  };
};
