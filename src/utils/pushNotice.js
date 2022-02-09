/*
 * @Author: chichiksky
 * @Date: 2022-02-08 21:54:20
 * @LastEditTime: 2022-02-09 21:45:09
 * @LastEditors: your name
 * @Description:
 * @FilePath: \iNote_BE\src\utils\pushNotice.js
 */
const noteTable = require("../models/noteTable");
const userTable = require("../models/userTable");
const noteService = require("../services/noteService");
const inspirecloud = require("@byteinspire/inspirecloud-api");
const ObjectId = inspirecloud.db.ObjectId;
const sendEmailFromQQ = require("./sendEmailFromQQ");
const items = [
  "",
  "任何时候做任何事，订最好的计划，尽最大的努力，作最坏的准备。",
  "你因成功而内心充满喜悦的时候，就没有时间颓废。",
  "最重要的就是不要去看远方模糊的，而要做手边清楚的事。",
  "吾观自古贤达人，成功不退皆殒身。",
  "理想是力量的泉源、智慧的摇篮、冲锋的战旗、斩棘的利剑。",
  "自己打败自己是最可悲的失败，自己战胜自己是最可贵的胜利。",
  "人所缺乏的不是才干而是志向，不是成功的能力而是勤劳的意志。",
];
// 推送笔记的hook方法
module.exports = async function (note) {
  // 找到对应的用户
  const user = await userTable.where({ _id: ObjectId(note.author) }).findOne();
  var text = `
  <h2>Hello！</h2>
  <h2><i>iNote</i> 提醒您，又到复习时间了</h2>
  <p>这是您笔记<strong>《${note.title}》</strong>的第<strong>${
    note.round
  }</strong>次推送,请及时登录网站复习哦!</p>
  <br/>
  <div style="padding-left: 20px;border-left: solid #4169E1 5px;">
  <q>${items[note.round]}</q>
  </div>`;
  // 调用QQ邮箱推送内容
  // 需要用户填写邮箱
  await sendEmailFromQQ(user.email, "iNote笔记推送", text);
  // 本地 console 调试打印
  console.log(text);
  // 如果此时是推送的最后一轮，则取消推送
  if (note.round === 7) {
    await noteService.cancelPush(note._id);
  } else note.round++;
  await noteTable.save(note);
  return;
};
