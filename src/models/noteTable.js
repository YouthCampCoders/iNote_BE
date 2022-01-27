/*
 * @Author: your name
 * @Date: 2022-01-27 21:35:39
 * @LastEditTime: 2022-01-27 21:56:24
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \iNote_BE\src\models\noteTable.js
 */
// 使用 larkcloud 调用轻服务功能
const inspirecloud = require('@byteinspire/inspirecloud-api');

// 使用轻服务 todo 表
// 若用户未创建，在发送第一条调用时会自动创建该表
const noteTable = inspirecloud.db.table('note');

// 导出 table 实例
module.exports = noteTable;