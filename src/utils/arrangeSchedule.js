const dayjs = require("dayjs");

const options = [
  [0, "minute"],
  [20, "minute"],
  [1, "hour"],
  [8, "hour"],
  [1, "day"],
  [2, "day"],
  [7, "day"],
  [1, "month"],
];

//  测试用
// const options = [
//   [0, "minute"],
//   [1, "minute"],
//   [2, "minute"],
//   [3, "minute"],
//   [4, "minute"],
//   [5, "minute"],
//   [6, "minute"],
//   [7, "minute"],
// ];

/**
 * 更改推送时间
 * @param pushTime 当前轮次推送的时间,默认为当前时间
 * @param round 笔记的当前推送轮次
 * @returns {Array} 返回时间表数组
 */
module.exports = function (pushTime = dayjs(), round = 0) {
  // 通过当前轮次推送的时间计算出初始轮次的时间,轮次为0时为现在时间
  const startTime = pushTime.subtract(options[round][0], options[round][1]);
  // 从初始轮次开始重新生成推送时间表
  return options.map((el) => startTime.add(el[0], el[1]).format());
};
