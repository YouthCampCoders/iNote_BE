const express = require("express");
const router = express.Router();

const noteController = require("../controllers/noteController");

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
router.get("/", wrap(noteController.listNotes));
router.get("/:year", wrap(noteController.listByYear));
router.post("/", wrap(noteController.create));
router.put("/:id", wrap(noteController.update));
router.delete("/:id", wrap(noteController.delete));

module.exports = router;
