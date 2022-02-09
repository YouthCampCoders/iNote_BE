/*
 * @Author: chichiksky
 * @Date: 2022-02-08 21:54:20
 * @LastEditTime: 2022-02-09 17:18:34
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \iNote_BE\src\utils\pushNotice.js
 */
const dayjs = require("dayjs");
const noteTable = require("../models/noteTable");
const userTable = require("../models/userTable");
const noteService = require("../services/noteService");
const inspirecloud = require("@byteinspire/inspirecloud-api");
const ObjectId = inspirecloud.db.ObjectId;
const sendEmailFromQQ = require("./sendEmailFromQQ");
// 推送笔记的hook方法
module.exports = async function (note) {
  const user = await userTable.where({ id: ObjectId(note.author) }).find();
  var text = `------
  笔记推送：
  _id: ${note._id}
  title: ${note.title}
  author: ${note.author}
  pushTime: ${note.schedule[note.round]}
  pushRound: ${note.round}
  realPushTime: ${dayjs().format()}
  ------`
  // 后续接入第三方推送
  sendEmailFromQQ(user.email, "推送成功!", text);
  // 暂时使用 console 调试
  console.log(text);

  // 如果此时是推送的最后一轮，则取消推送
  if (note.round === 7) {
    await noteService.cancelPush(note._id);
  } else note.round++;
  await noteTable.save(note);
  return;
};