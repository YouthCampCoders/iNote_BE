/**
 * 删除数组元素
 * @param arr 目标数组
 * @param value 待删除的元素
 * @return {Array} 返回删除元素后的新数组
 */
module.exports = function (arr, value) {
  return arr.filter((el) => {
    return el != value;
  });
};
