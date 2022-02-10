const dayjs = require("dayjs");
const isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
dayjs.extend(isSameOrAfter);
const noteTable = require("../models/noteTable");
const pushNotice = require("../utils/pushNotice");

module.exports = function () {
  // 对笔记数据表做轮询
  setInterval(async () => {
    const now = dayjs();
    const noteList = await noteTable.where({ needPush: true }).find();
    // 筛选出已经达到推送时间的笔记
    const pushList = noteList.filter((note) =>
      now.isSameOrAfter(dayjs(note.schedule[note.round]))
    );
    // 日志
    console.log(`${dayjs().format("M月D日 HH:mm:ss")} pushList:${pushList}`);
    // 推送hook，对每一个待推送笔记调用推送方法
    pushList.forEach(async (note) => {
      await pushNotice(note);
    });
  }, 60000);
};
