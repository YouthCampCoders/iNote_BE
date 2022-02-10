const dayjs = require("dayjs");
const inspirecloud = require("@byteinspire/inspirecloud-api");
const userController = require("../controllers/userController");
const noteTable = require("../models/noteTable");
const db = inspirecloud.db;
const ObjectId = inspirecloud.db.ObjectId;
const removeItem = require("../utils/removeItem");
const arrangeSchedule = require("../utils/arrangeSchedule");

/**
 * NoteService
 * Service 是业务具体实现，由 Controller 或其它 Service 调用
 * 包含笔记的增删改查功能
 */
class NoteService {
  /**
   * 列出用户的所有笔记
   * @param {Object} options 具体的限制条件
   * @return {Object[]} 返回笔记数组
   */
  static async listNotes(options) {
    const list = await noteTable.where(options).find();
    return {
      success: true,
      list,
      message: "拉取成功!",
    };
  }

  /**
   * 创建一篇笔记
   * @param newNote 用于创建笔记的数据,内部含有字段author为用户的_id,用于区分作者,原样存进数据库
   * @return {Object[]} 返回存入数据库的数据
   */
  static async create(newNote) {
    await noteTable.save(noteTable.create(newNote));
    return {
      success: true,
      note: newNote,
      message: "添加成功!",
    };
  }

  /**
   * 删除一条笔记
   * @param id 笔记的 _id
   * @param author 笔记作者的 _id
   * @param tags 笔记作者名下的所有笔记的标签
   * @param years 笔记作者名下的所有笔记的年份
   * 若不存在，则抛出 404 错误
   */
  static async delete(id, author, tags, years) {
    const note = await noteTable.where({ _id: ObjectId(id) }).findOne();
    // 储存当前文章的tag和year
    const tag = note.tag;
    const year = dayjs(note.createdAt).year();
    // 从笔记表中移除该笔记
    await noteTable.where({ _id: ObjectId(id) }).delete();
    // 查询作者名下是否还有相同tag
    const tagsLeft = await noteTable.where({ author, tag }).find();
    // 如果此时已经不存在当前标签了,则在用户表中也删除该字段
    if (tagsLeft.length === 0) {
      const newTags = removeItem(tags, tag);
      await userController.updateOne(author, ["tags"], [newTags]);
    }
    // 查询作者名下是否还有相同year
    const from = new Date(`${year}-01-01 00:00:00+08`);
    const to = new Date(`${year}-12-31 23:59:59+08`);
    const yearsLeft = await noteTable
      .where({ author, createdAt: db.gt(from).lte(to) })
      .find();
    // 如果此时已经不存在当前标签了,则在用户表中也删除该字段
    if (yearsLeft.length === 0) {
      const newYears = removeItem(years, year);
      await userController.updateOne(author, ["years"], [newYears]);
    }
    return {
      success: true,
      message: "删除成功!",
    };
  }

  /**
   * 更新一条笔记
   * @param id 笔记的 _id
   * @param updater 将会用原对象 merge 此对象进行更新
   * 若不存在，则抛出 404 错误
   */
  static async update(id, title, content, needPush) {
    const note = await noteTable.where({ _id: ObjectId(id) }).findOne();
    if (needPush) {
      note.schedule = arrangeSchedule();
    } else {
      note.schedule = [];
    }
    note.round = 1;
    note.title = title;
    note.content = content;
    note.needPush = needPush;
    await noteTable.save(note);
    return {
      success: true,
      message: "更新成功",
    };
  }

  /**
   * 取消推送
   * @param id 笔记的 _id
   */
  static async cancelPush(id) {
    // 从 note 表中将该笔记修改为无需推送
    const note = await noteTable.where({ _id: ObjectId(id) }).findOne();
    note.needPush = false;
    note.schedule = [];
    note.round = 1;
    await noteTable.save(note);
    return {
      success: true,
      message: "更新成功",
    };
  }

  /**
   * 更改推送时间
   * @param id 笔记的 _id
   * @param date 笔记的下一次推送时间
   */
  static async reSchedule(id, date) {
    // 重新修改笔记推送时间
    const note = await noteTable.where({ _id: ObjectId(id) }).findOne();
    note.schedule = arrangeSchedule(dayjs(date), note.round);
    await noteTable.save(note);
    return {
      success: true,
      message: "更新成功",
    };
  }
}

// 导出 Servic
module.exports = NoteService;
