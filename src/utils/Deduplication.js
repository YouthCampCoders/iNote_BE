/**
 * 用于给标签数组去重添加
 * @param {String[]} arr 目标数组
 * @param {String} data 待添加数据
 * @return {String[]} 返回去重后的数组
 */
module.exports = function (arr, data) {
  arr.push(data);
  const tempSet = new Set(arr);
  return [...tempSet];
};
