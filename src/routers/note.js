/*
 * @Author: your name
 * @Date: 2022-01-27 21:25:02
 * @LastEditTime: 2022-01-27 21:26:26
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \iNote_BE\src\routers\note.js
 */
const express = require('express');
const router = express.Router();

// const todoController = require('../controllers/todoController');

// Express 是通过 next(error) 来表达出错的，无法识别 async 函数抛出的错误
// wrap 函数的作用在于将 async 函数抛出的错误转换为 next(error)
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
router.put('/:id', wrap(todoController.done));
router.get('/', wrap(todoController.listAll));
router.post('/', wrap(todoController.create));
router.delete('/:id', wrap(todoController.delete));

module.exports = router;
