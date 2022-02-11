const dayjs = require("dayjs");
const inspirecloud = require("@byteinspire/inspirecloud-api");
const userController = require("../controllers/userController");
const noteTable = require("../models/noteTable");
const pushTable = require("../models/pushTable");
const db = inspirecloud.db;
const ObjectId = inspirecloud.db.ObjectId;
const removeItem = require("../utils/removeItem");
const deduplication = require("../utils/deduplication");
const pushService = require("./pushService");

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
   * @param title 笔记的标题
   * @param content 笔记的内容
   * @param needPush 笔记是否需要推送
   * @param user 笔记作者信息
   * @param tag 笔记的标签
   * @return {Object[]} 返回存入数据库的数据
   */
  static async create(title, content, needPush, user, tag) {
    let result = {
      success: true,
      message: "添加成功!",
    };
    // 创建数据库对象
    const newNote = noteTable.create({
      title,
      content,
      needPush,
      author: user._id,
      tag,
    });
    if (needPush) {
      // 如果需要推送而用户未填写邮箱
      if (!user.email) {
        result.message = "未填写邮箱，无法发送邮件，已为您保存文章！";
        newNote.needPush = false;
      } else {
        const pushTime = await pushService.create(
          title,
          user.email,
          newNote._id
        );
        newNote.pushTime = pushTime;
      }
    }
    await noteTable.save(newNote);
    // 储存用户标签和年份列表
    let tags = user.tags || [];
    let years = user.years || [];
    // 更改对应用户的标签和年份列表
    const year = dayjs().year();
    tags = deduplication(tags, tag);
    years = deduplication(years, year);
    await userController.updateOne(user._id, ["tags", "years"], [tags, years]);
    result.note = newNote;
    return result;
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
    // 如果该笔记还在推送中，则将其取消推送
    if (note.needPush) await this.cancelPush(id);
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
   * 更新
   * @param id 笔记id
   * @param title 笔记标题
   * @param content 笔记正文
   * @param needPush 笔记是否需要推送
   * @param email 用户email
   * 若不存在，则抛出 404 错误
   */
  static async update(id, title, content, needPush, email) {
    let result = {
      success: true,
      message: "更新成功",
    };
    const note = await noteTable.where({ _id: ObjectId(id) }).findOne();
    let pushTime;
    // 如果需要推送
    if (needPush) {
      const push = await pushTable.where({ noteId: ObjectId(id) }).findOne();
      // 如果之前没有进行过推送，则新建；已有推送，则保持现状
      if (!push) {
        // 如果没有email
        if (!email) {
          result.message = "未填写邮箱，无法发送邮件，已为您保存文章！";
          needPush = false;
        } else pushTime = await pushService.create(title, email, id);
      }
    }
    // 如果不需要推送，则删除推送表内相应记录
    else await pushService.delete(id);
    // 更新笔记信息
    Object.assign(note, { needPush, title, content, pushTime });
    await noteTable.save(note);
    return result;
  }

  /**
   * 取消推送
   * @param id 笔记的 _id
   */
  static async cancelPush(id) {
    // 从 note 表中将该笔记修改为无需推送
    const note = await noteTable.where({ _id: ObjectId(id) }).findOne();
    note.needPush = false;
    note.pushTime = undefined;
    await noteTable.save(note);
    await pushService.delete(id);
    return {
      success: true,
      message: "取消推送成功！",
    };
  }

  /**
   * 更改推送时间
   * @param id 笔记的 _id
   * @param date 笔记的下一次推送时间
   */
  static async reSchedule(id, date) {
    // 在 push 表内修改推送时间
    await pushService.edit(id, new Date(date));
    const note = await noteTable.where({ _id: ObjectId(id) }).findOne();
    note.pushTime = date;
    await noteTable.save(note);
    return {
      success: true,
      message: "更新成功",
    };
  }
}

// 导出 Servic
module.exports = NoteService;
