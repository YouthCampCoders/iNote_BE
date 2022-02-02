module.exports = function (arr, value) {
  return arr.filter((el) => {
    return el != value;
  });
};
