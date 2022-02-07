const fileService = require("../services/fileService");

class FileController {
  static async uploadFile(req, res) {
    // 从请求参数中获取文件，请求 Content-Type 需要为 multipart/form-data
    // 调用 Service 层对应的业务处理方法
    // 暂为一次上传一个图片
    const result = await fileService.uploadFile(req.files[0]);
    res.send(result);
  }

  static async deleteFile(req, res) {
    const { url } = req.body;
    const result = await fileService.deleteFile(url);
    res.send(result);
  }
}

// 导出 Controller
module.exports = FileController;
