/*
 * @Author: chichiksky
 * @Date: 2022-01-28 10:40:45
 * @LastEditTime: 2022-01-28 15:16:15
 * @LastEditors: your name
 * @Description: 
 * @FilePath: \iNote_BE\src\controllers\userCOntroller.js
 */
const inspirecloud = require('@byteinspire/inspirecloud-api');
const ObjectId = inspirecloud.db.ObjectId;
/**
 * userController 关于用户系统的一些api;
 */
class UserController {
  /**
   * 发送短信API
   */
  async sendMessageAPI(req, res) {
    const {phoneNumber} = req.query;
    await inspirecloud.user.sendSMS(req, phoneNumber);
    res.send({ success: true });
  }

  /**
   * 手机号+密码登录
   */
  async loginAPI(req, res) {
    const {phoneNumber, code} = req.body;
      // 调用 inspirecloud.user.loginByPhone 校验验证码并登录，如果校验通过，会返回登录后的用户信息
      const userInfo = await inspirecloud.user.loginByPhone(
        req,
        phoneNumber,
        code // 对应手机号上接到的验证码
      );
      // console('userInfo', userInfo)
      res.send({ success: true, userInfo });
  }

  /**
   * 用户名+密码登录
   */
   async loginByUsername(req, res) {
    const { username, password } = req.body;
      // 调用 inspirecloud.user.login 如果校验通过，会返回登录后的用户信息
      const userInfo = await inspirecloud.user.login(
        req,
        username,
        password
      );
      res.send({ success: true, userInfo });
  }

  /**
   * 获取登录信息
   */
  async getUserInfo(req, res) {
    const userInfo = await inspirecloud.user.current(req);
    if(!userInfo){
      const error = new Error(`用户未登录`);
      error.status = 401;
      throw error;
    }
    res.send({ success: true, userInfo });
  }

  /** 
   * 修改用户信息 需处于登录态
   */
  async updateUserData(req, res) {
    const { username, avatar, intro } = req.body;

    await inspirecloud.user.updateOne(
      req,
      { username, avatar, intro } // 这里是需要更新用户信息
    );
    res.send({ success:true });

  }

  /**
   * 设置密码或修改密码 需处于登录态
   */
  async changePassword(req, res) {
    const { newPassword, originPassword } = req.body;
    await inspirecloud.user.changePassword(
      req, // 注意，调用所有 inspirecloud.user 相关接口时，都需要传入云函数中的 context
      newPassword,
      originPassword
    );
    res.send({success: true})
  }

  /**
   * 判断用户是否拥有密码
   */
   async getPasswordExist(req, res) {
    const userTable = inspirecloud.db.table('_user');
    const { _id } = await inspirecloud.user.current(req);
    const { passhash } = await userTable.where({ _id: ObjectId(_id) }).findOne();
    res.send({
      success: !!passhash,
    })
  }

  /**
   * 退出登录
   */
  async logout(req, res) {
    await inspirecloud.user.logout(req);
    res.send({success: true})
  }
}

// 导出 Controller 的实例
module.exports = new UserController();
