const fileTable = require("../models/fileTable");
const inspirecloud = require("@byteinspire/inspirecloud-api");

/**
 * FileService
 * Service 是业务具体实现，由 Controller 或其它 Service 调用
 * 包含笔记的增删改查功能
 */
class FileService {
  /**
   * 上传文件
   * @param file 为用户上传的文件
   * @return {String} 返回实际插入数据库的文件的url
   */
  async uploadFile(myFile) {
    const { url } = await inspirecloud.file.upload(
      myFile.originalname, // 文件名
      myFile.buffer, // 文件内容
      {
        type: myFile.mimetype, // 文件类型，不传则会根据文件后缀名自动识别
      }
    );
    return url;
  }

  /**
   * 删除文件
   * @param url 为用户上传的文件url
   * @return {success: true} 返回删除成功信息
   */
  async deleteFile(key) {
    await inspirecloud.file.delete(key);
  }
}

// 导出 Service 的实例
module.exports = new FileService();
