const noteService = require("../services/noteService");
const inspirecloud = require("@byteinspire/inspirecloud-api");
const db = inspirecloud.db;
class NoteController {
  // 拉取笔记
  static async listNotes(req, res) {
    const { tag, year, needPush } = req.query;

    const options = {
      author: req._user._id,
    };
    // 如果传入了 year 参数
    if (year) {
      const from = new Date(`${year}-01-01 00:00:00+08`);
      const to = new Date(`${year}-12-31 23:59:59+08`);
      options.createdAt = db.gt(from).lte(to);
    }
    // 如果传入了 tag 参数
    if (tag) options.tag = tag;
    // 如果传入了 needPush 参数
    if (needPush) options.needPush = JSON.parse(needPush);
    // 调用 Service 层对应的业务处理方法
    const result = await noteService.listNotes(options);
    res.send(result);
  }
  // 新建笔记
  static async create(req, res) {
    // 解析参数
    let { title, content, needPush, tag = "未分类" } = req.body;
    // 调用 Service 层对应的业务处理方法
    const result = await noteService.create(
      title,
      content,
      needPush,
      req._user,
      tag
    );
    res.send(result);
  }
  // 更新笔记
  static async update(req, res) {
    // 调用 Service 层对应的业务处理方法
    const { title, content, needPush } = req.body;
    const result = await noteService.update(
      req.params.id,
      title,
      content,
      needPush
    );
    res.send(result);
  }
  // 删除笔记
  static async delete(req, res) {
    // 调用 Service 层对应的业务处理方法
    const id = req.params.id;
    const author = req._user._id;
    const tags = req._user.tags || [];
    const years = req._user.years || [];
    const result = await noteService.delete(id, author, tags, years);
    res.send(result);
  }
  // 取消推送
  static async cancelPush(req, res) {
    // 调用 Service 层对应的业务处理方法
    const id = req.params.id;
    const result = await noteService.cancelPush(id);
    res.send(result);
  }
  // 更改推送时间
  static async reSchedule(req, res) {
    // 调用 Service 层对应的业务处理方法
    const id = req.params.id;
    const { date } = req.body;
    const result = await noteService.reSchedule(id, new Date(date));
    res.send(result);
  }
}

// 导出 Controller
module.exports = NoteController;
