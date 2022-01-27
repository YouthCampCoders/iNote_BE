function arrayRemove(arr, value) {
  return arr.filter((el) => {
    return el != value;
  });
}
module.exports = arrayRemove;
