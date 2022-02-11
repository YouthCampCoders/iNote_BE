function NoteDemo(author) {
  return {
    title: "您的第一条笔记",
    content: `# 🎉 欢迎来到 iNote

---

> 欢迎加入iNote的大家庭！这是一篇示例笔记，您可以使用Markdown格式或者编写HTML标签，让您的笔记更加丰富多彩
> 
> 项目地址：[GitHub - YouthCampCoders](https://github.com/YouthCampCoders)

## 在这里您可以记录:

1. 生活琐事
2. 心得感受
3. 读书笔记

## 在这里您可以收获:

- 更简洁的界面
- 更高效的记忆
- 更自由的分享

# 支持多种格式

---

文本**加粗**，强调内容

重要文本\`高亮\`显示，不再错失重点

弃用文字使用~~删除线~~，文字结构更加清晰

大块代码也能轻松显示

\`\`\`
module.exports = function (pushTime = dayjs(), round = 0) {
  // 通过当前轮次推送的时间计算出初始轮次的时间，轮次为0时为现在时间
  const startTime = pushTime.subtract(options[round][0], options[round][1]);
  // 从初始轮次开始重新生成推送时间表
  return options.map((el) => startTime.add(el[0], el[1]).format());
};
\`\`\`

方便快捷的引用：

> 人所缺乏的不是才干而是志向，不是成功的能力而是勤劳的意志。

结合艾宾浩斯遗忘曲线推送，让您的记忆更加深刻！

## 更多功能，等您探索！

`,
    author,
    needPush: false,
    tag: "未分类",
  };
}

module.exports = NoteDemo;
