const fileService = require("../services/fileService");

class FileController {
  async uploadFile(req, res) {
    // 从请求参数中获取文件，请求 Content-Type 需要为 multipart/form-data
    // 调用 Service 层对应的业务处理方法
    // 暂为一次上传一个图片
    const result = await fileService.uploadFile(req.files[0]);
    res.send({
      success: true,
      result,
      message: "上传成功!",
    });
  }

  async deleteFile(req, res) {
    const { url, _id } = req.body;
    // 动态键选择按照url或者id删除文件
    const key = url ? url : _id;
    await fileService.deleteFile(key);
    res.send({
      success: true,
      message: "删除成功!",
    });
  }
}

// 导出 Controller 的实例
module.exports = new FileController();
