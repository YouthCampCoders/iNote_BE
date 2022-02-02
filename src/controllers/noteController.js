const noteService = require("../services/noteService");
const userController = require("../controllers/userController");
const Deduplication = require("../utils/Deduplication");

class NoteController {
  async listAll(req, res) {
    // 调用 Service 层对应的业务处理方法
    const result = await noteService.listAll(req._user._id);
    res.send(result);
  }

  async create(req, res) {
    const author = req._user._id;
    let tags = req._user.tags;
    let { title, content, needPush, tag } = req.body;
    // 如果没有tag则默认为"未分类"
    tag = tag ? tag : "未分类";
    // 调用 Service 层对应的业务处理方法
    const result = await noteService.create({
      title,
      content,
      needPush,
      author,
      tag,
    });
    // 更改对应用户的标签列表
    tags = Deduplication(tags, tag);
    await userController.updateOne(author, "tags", tags);
    res.send(result);
  }

  async update(req, res) {
    // 调用 Service 层对应的业务处理方法
    const author = req._user._id;
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
    const result = await noteService.delete(
      req.params.id,
      req._user._id,
      req._user.tags
    );
    res.send(result);
  }
}

// 导出 Controller 的实例
module.exports = new NoteController();
