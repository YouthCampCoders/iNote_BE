/*
 * @Author: chichiksky
 * @Date: 2022-02-11 10:39:46
 * @LastEditTime: 2022-02-11 11:10:28
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \iNote_BE\src\services\pushService.js
 */
const dayjs = require("dayjs");
const pushTable = require("../models/pushTable");
const scheduleOptions = require("../scheduleOptions");
class PushService {
  /**
   * 创建一个推送信息
   */
  static async create(title, email,noteId) {
      // 如果需要推送，生成推送时间
      let pushTime = dayjs()
        .add(scheduleOptions[1][0], scheduleOptions[1][1])
        .format();
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
  }

  /**
  * 修改推送信息
  */
  static async edit(noteId,pushTime) {
    const info = await pushTable.where(noteId).findOne();
    info.pushTime = pushTime;
    await pushTable.save(info);
  }
  /**
  * 取消推送
  */
  static async delete(noteId) {
    await pushTable.where(noteId).delete();
  }
}
module.exports = PushService;