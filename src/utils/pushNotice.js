const noteTable = require("../models/noteTable");
const noteService = require("../services/noteService");
// 推送笔记的hook方法
module.exports = async function (note) {
  // 后续接入第三方推送
  // 暂时使用 console 调试
  console.log(`title: ${note.title},
  author: ${note.author}
  pushTime: ${note.schedule[note.round]}
  pushRound: ${note.round}`);
  // 如果此时是推送的最后一轮，则取消推送
  if (note.round === 7) {
    noteService.cancelPush(note._id);
  } else note.round++;
  await noteTable.save(note);
  return;
};
