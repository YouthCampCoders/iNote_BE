const express = require("express");
const router = express.Router();
const multer = require("multer");

const fileController = require("../controllers/fileController");

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
router.post("/", multer().any(), wrap(fileController.uploadFile));
router.delete("/", wrap(fileController.deleteFile));

module.exports = router;
