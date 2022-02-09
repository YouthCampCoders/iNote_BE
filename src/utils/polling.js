const dayjs = require("dayjs");
const isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);
const noteTable = require("../models/noteTable");
const pushNotice = require("../utils/pushNotice");

module.exports = function () {
  // 每半分钟对笔记数据表做轮询
  setInterval(async () => {
    const now = dayjs();
    const start = now.startOf("minute");
    const end = now.endOf("minute");
    const noteList = await noteTable.where({ needPush: true }).find();
    // 筛选出在这一分钟内达到推送时间的笔记
    const pushList = noteList.filter((el) =>
      dayjs(el.schedule[el.round]).isBetween(start, end)
    );
    // 推送hook，对每一个待推送笔记调用推送方法
    pushList.forEach((el) => {
      pushNotice(el);
    });
  }, 30000);
};
