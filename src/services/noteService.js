const noteTable = require("../models/noteTable");
const inspirecloud = require("@byteinspire/inspirecloud-api");
const ObjectId = inspirecloud.db.ObjectId;

/**
 * NoteService
 * Service 是业务具体实现，由 Controller 或其它 Service 调用
 * 包含笔记的增删改查功能
 */
class NoteService {
  /**
   * 列出用户的所有笔记
   * @param author 用户的 _id
   * @return {Promise<Array<String>>} 返回笔记数组
   */
  async listAll(author) {
    // 暂时不知道为什么这里不用加 ObjectId()
    const list = await noteTable.where({ author: author }).find();
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
   * 若不存在，则抛出 404 错误
   */
  async delete(id, author) {
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
    // 从笔记表中移除
    await noteTable.where({ _id: ObjectId(id) }).delete();
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
        message: `无权修改`,
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
