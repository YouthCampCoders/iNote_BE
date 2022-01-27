/*
 * @Author: your name
 * @Date: 2022-01-27 21:36:00
 * @LastEditTime: 2022-01-27 21:46:31
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \iNote_BE\src\services\noteService.js
 */
const noteTable = require('../models/noteTable');
const inspirecloud = require('@byteinspire/inspirecloud-api');
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
   * @return {Promise<Array<any>>} 返回笔记数组
   */
  async listAll() {
    const all = await noteTable.where({author: ObjectId(author)}).find();
    return all;
  }

  /**
   * 创建一篇笔记
   * @param note 用于创建笔记的数据,内部含有字段author为用户的_id,用于区分作者,原样存进数据库
   * @return {Promise<any>} 返回实际插入数据库的数据，会增加_id，createdAt和updatedAt字段
   */
  async create(note) {
    return await noteTable.save(note);
  }

  /**
   * 删除一条笔记
   * @param id 笔记的 _id
   * 若不存在，则抛出 404 错误
   */
  async delete(id) {
    const result = await noteTable.where({_id: ObjectId(id)}).delete();
    if (result.deletedCount===0) {
      const error = new Error(`note:${id} not found`);
      error.status = 404;
      throw error;
    }
  }

  /**
   * 更新一条笔记
   * @param id 笔记的 _id
   * @param updater 将会用原对象 merge 此对象进行更新
   * 若不存在，则抛出 404 错误
   */
  async update(id, updater) {
    const note = await noteTable.where({_id: ObjectId(id)}).findOne();
    if (!note) {
      const error = new Error(`note:${id} not found`);
      error.status = 404;
      throw error;
    }
    Object.assign(note, updater);
    await noteTable.save(note);
  }
}

// 导出 Service 的实例
module.exports = new NoteService();
