const noteService = require("../services/noteService");
const userController = require("../controllers/userController");
const Deduplication = require("../utils/Deduplication");
const inspirecloud = require("@byteinspire/inspirecloud-api");
const db = inspirecloud.db;
const dayjs = require("dayjs");
class NoteController {
  // 拉取笔记
  async listNotes(req, res) {
    const { tag, year } = req.query;
    const options = {
      author: req._user._id,
      tag,
    };
    // 如果传入了year参数
    if (year) {
      const from = new Date(`${year}-01-01 00:00:00+08`);
      const to = new Date(`${year}-12-31 23:59:59+08`);
      options.createdAt = db.gt(from).lte(to);
    }
    // 调用 Service 层对应的业务处理方法
    const result = await noteService.listNotes(options);
    res.send(result);
  }

  async create(req, res) {
    const author = req._user._id;
    let tags = req._user.tags || [];
    let years = req._user.years || [];
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
    // 更改对应用户的标签和年份列表
    const year = dayjs().year();
    tags = Deduplication(tags, tag);
    years = Deduplication(years, year);
    await userController.updateOne(author, ["tags", "years"], [tags, years]);
    // 更改对应用户的年份列表
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
    const id = req.params.id;
    const author = req._user._id;
    const tags = req._user.tags || [];
    const years = req._user.years || [];
    const result = await noteService.delete(id, author, tags, years);
    res.send(result);
  }
}

// 导出 Controller 的实例
module.exports = new NoteController();
