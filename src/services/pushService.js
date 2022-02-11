/*
 * @Author: chichiksky
 * @Date: 2022-02-11 10:39:46
 * @LastEditTime: 2022-02-11 14:51:30
 * @LastEditors: your name
 * @Description:
 * @FilePath: \iNote_BE\src\services\pushService.js
 */
const dayjs = require("dayjs");
const pushTable = require("../models/pushTable");
const scheduleOptions = require("../scheduleOptions");
const inspirecloud = require("@byteinspire/inspirecloud-api");
const ObjectId = inspirecloud.db.ObjectId;
class PushService {
  /**
   * 创建一个推送信息
   */
  static async create(title, email, noteId) {
    // 如果需要推送，生成推送时间
    let pushTime = dayjs()
      .add(scheduleOptions[1][0], scheduleOptions[1][1])
      .format();
    // 转换成日期对象
    pushTime = new Date(pushTime);
    // 保存推送记录
    await pushTable.save(
      pushTable.create({
        title,
        email,
        round: 1,
        noteId,
        pushTime,
      })
    );
    return pushTime;
  }

  /**
   * 修改推送信息
   * @param noteId 笔记的id
   * @param pushTime 下次推送时间，类型为日期对象
   */
  static async edit(noteId, pushTime) {
    const info = await pushTable.where({ noteId: ObjectId(noteId) }).findOne();
    info.pushTime = pushTime;
    await pushTable.save(info);
  }
  /**
   * 取消推送
   */
  static async delete(noteId) {
    await pushTable.where({ noteId: ObjectId(noteId) }).delete();
  }
}
module.exports = PushService;
