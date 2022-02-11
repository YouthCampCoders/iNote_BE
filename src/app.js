/*
 * @Author: your name
 * @Date: 2022-01-27 17:52:20
 * @LastEditTime: 2022-01-28 17:10:40
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \iNote_BE\src\app.js
 */
const path = require("path");
const express = require("express");
// 引入路由
const noteRouter = require("./routers/note");
const userRouter = require("./routers/user");
const fileRouter = require("./routers/file");
// 引入中间件
const authMiddleWare = require("./middleWare/auth");
// 创建服务
const app = express()
  // 静态文件中间件
  .use(express.static(path.join(__dirname, "../public")))
  // 请求体 parse 中间件，用于 parse json 格式请求体
  .use(express.json())
  // 业务路由
  .use("/user", userRouter)
  .use("/note", authMiddleWare(), noteRouter)
  .use("/file", authMiddleWare(), fileRouter)
  // 若无匹配业务路由，则匹配 404 路由，代表访问路径不存在
  .use(notFound)
  /** 若前面的路由抛错，则封装为错误响应返回
   * 错误响应格式为
   * {
   *   message: err.message
   * }
   */
  .use(errorHandler);

function notFound(req, res) {
  res.status(404);
  res.send({
    success: false,
    message: "not found",
  });
}

function errorHandler(err, req, res, next) {
  // 抛出的错误可以附带 status 字段，代表 http 状态码
  // 若没有提供，则默认状态码为 500，代表服务器内部错误
  res.status(err.status || 500);
  res.send({ success: false, message: err.message });
}
// 导出 Express 对象
module.exports = app;
