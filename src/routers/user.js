/*
 * @Author: chichiksky
 * @Date: 2022-01-28 11:24:29
 * @LastEditTime: 2022-01-28 14:40:21
 * @LastEditors: your name
 * @Description:
 * @FilePath: \iNote_BE\src\routers\user.js
 */
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
function wrap(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (e) {
      next(e);
    }
  };
}

// 组装路由
router.get("/sendMessage", wrap(userController.sendMessageAPI));
router.get("/info", wrap(userController.getUserInfo));
router.get("/pwExist", wrap(userController.getPasswordExist));
router.put("/info", wrap(userController.updateUserData));
router.post("/phoneLogin", wrap(userController.loginAPI));
router.post("/userLogin", wrap(userController.loginByUsername));
router.post("/changePassword", wrap(userController.changePassword));
router.post("/logout", wrap(userController.logout));
router.post("/registerByUsername", wrap(userController.registerByUsername));

module.exports = router;
