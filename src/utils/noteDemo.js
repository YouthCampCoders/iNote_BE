function NoteDemo(author) {
  return {
    title: "你的第一条笔记",
    content: `<h1>欢迎来到 iNote</h1>
    <h2>在这里你可以记录:</h2>
    <ol>
      <li>生活琐事</li>
      <li>心得感受</li>
      <li>读书笔记</li>
    </ol>
    <h2>在这里你可以收获:</h2>
    <ul>
      <li>更简洁的界面</li>
      <li>更高效的记忆</li>
      <li>更自由的分享</li>
    </ul>
    <h2>支持多种格式</h2>
    <p>重要文本<mark>高亮</mark>显示,不再错失重点</p>
    <p><del>弃用文字使用删除线,文字结构更加清晰</del></p>
    <p><u>长文字划重点使用下划线,阅读长文本不再困难</u></p>
    <p><small>特殊的小号字体,让你的页面更有活力</small></p>
    <p><b>粗体字体,使文本拥有重量</b></p>
    <p><i>斜体字体,也可以拿来引用文字</i></p>
    <h2>艾宾浩斯遗忘曲线</h3>
    <p>在你最容易忘记笔记内容的时候,通过推送提醒您重温复习,让知识记忆不再困难</p>
    <h3>更多功能,等您发现!</h3>`,
    author,
    needPush: false,
    tag: "未分类",
    schedule: [],
    round: 1,
  };
}

module.exports = NoteDemo;
