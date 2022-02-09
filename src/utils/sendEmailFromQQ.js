/*
 * @Author: chichiksky
 * @Date: 2022-02-09 15:15:57
 * @LastEditTime: 2022-02-09 15:29:02
 * @LastEditors: your name
 * @Description:
 * @FilePath: \iNote_BE\src\utils\sendEmailFromQQ.js
 */
const nodeMailer = require("nodeMailer");
module.exports = async (to, subject, html) => {
  const cfg = require("../config");
  if (!cfg || !cfg.user || !cfg.pass) return;
  const transporter = nodeMailer.createTransport({
    service: "qq",
    auth: { user: cfg.user, pass: cfg.pass },
  });
  transporter.sendMail(
    {
      from: cfg.from,
      to,
      subject: subject,
      html: html,
    },
    (err) => {
      if (err) return console.log(`发送邮件失败：${err}`, true);
      console.log("发送邮件成功");
    }
  );
};
