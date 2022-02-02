const noteTable = require("../models/noteTable");
const inspirecloud = require("@byteinspire/inspirecloud-api");
const db = inspirecloud.db;
const ObjectId = inspirecloud.db.ObjectId;
const removeItem = require("../utils/removeItem");
const userController = require("../controllers/userController");
const dayjs = require("dayjs");

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
  async listNotes(options) {
    const list = await noteTable.where(options).find();
    return {
      success: true,
      list,
      message: "拉取成功!",
    };
  }

  /**
   * 列出用户名下标签为 tag 的所有笔记
   * @param {string} author 作者的 _id
   * @param {string} tag 文章的标签
   * @return {Object[]} 返回笔记数组
   */
  async listByTag(author, tag) {
    const list = await noteTable.where({ author, tag }).find();
    return {
      success: true,
      list,
      message: "拉取成功!",
    };
  }

  /**
   * 创建一篇笔记
   * @param newNote 用于创建笔记的数据,内部含有字段author为用户的_id,用于区分作者,原样存进数据库
   * @return {Promise<any>} 返回实际插入数据库的数据，会增加_id，createdAt和updatedAt字段
   */
  async create(newNote) {
    await noteTable.save(noteTable.create(newNote));
    return {
      success: true,
      message: "添加成功!",
    };
  }

  /**
   * 删除一条笔记
   * @param id 笔记的 _id
   * @param author 笔记作者的 _id
   * @param tags 笔记作者名下的所有的标签
   * 若不存在，则抛出 404 错误
   */
  async delete(id, author, tags, years) {
    const note = await noteTable.where({ _id: ObjectId(id) }).findOne();
    // 判断是否存在
    if (!note) {
      return {
        success: false,
        message: "笔记不存在!",
      };
    }
    // 判断是否是登录用户的文章
    if (note.author != author) {
      return {
        success: false,
        message: `无权修改`,
      };
    }
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
  async update(id, author, updater) {
    const note = await noteTable.where({ _id: ObjectId(id) }).findOne();
    // 判断是否存在
    if (!note) {
      return {
        success: false,
        message: "笔记不存在!",
      };
    }
    // 判断是否是登录用户的文章
    if (note.author != author) {
      return {
        success: false,
        message: "无权修改",
      };
    }
    Object.assign(note, updater);
    await noteTable.save(note);
    return {
      success: true,
      message: "更新成功",
    };
  }

  /**
   * 按时间顺序归档
   * @param id 笔记的 _id
   * @param updater 将会用原对象 merge 此对象进行更新
   * 若不存在，则抛出 404 错误
   */
  async update(id, author, updater) {
    const note = await noteTable.where({ _id: ObjectId(id) }).findOne();
    // 判断是否存在
    if (!note) {
      return {
        success: false,
        message: "笔记不存在!",
      };
    }
    // 判断是否是登录用户的文章
    if (note.author != author) {
      return {
        success: false,
        message: "无权修改",
      };
    }
    Object.assign(note, updater);
    await noteTable.save(note);
    return {
      success: true,
      message: "更新成功",
    };
  }
}

// 导出 Service 的实例
module.exports = new NoteService();
