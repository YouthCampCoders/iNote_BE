const noteService = require("../services/noteService");

class NoteController {
  async listAll(req, res) {
    // 调用 Service 层对应的业务处理方法
    const result = await noteService.listAll(req.author);
    res.send(result);
  }

  async create(req, res) {
    const author = req.author;
    const { title, content, needPush } = req.body;
    // 调用 Service 层对应的业务处理方法
    const result = await noteService.create({
      title,
      content,
      needPush,
      author,
    });
    res.send(result);
  }

  async update(req, res) {
    // 调用 Service 层对应的业务处理方法
    const author = req.author;
    const { title, content, needPush } = req.body;
    const result = await noteService.update(req.params.id, author, {
      title,
      content,
      needPush,
      author,
    });
    res.send(result);
  }

  async delete(req, res) {
    // 调用 Service 层对应的业务处理方法
    const result = await noteService.delete(req.params.id, req.author);
    res.send(result);
  }
}

// 导出 Controller 的实例
module.exports = new NoteController();
