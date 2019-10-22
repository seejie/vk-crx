// 创建周报 => 导入模板
const importBtn = {
  _data: `<h3 id="id-01模板-标题为【姓名-xxx年xxx月xxx日】-【本周工作计划】">【本周工作计划】</h3><ol><li>item1</li><li>item2</li><li>item3</li></ol><h3 id="id-01模板-标题为【姓名-xxx年xxx月xxx日】-【本周工作进展】">【本周工作进展】</h3><ol><li>10日<ol><li>工作内容1</li><li>工作内容2</li></ol></li><li>11日<ol><li>工作内容1</li><li>工作内容2</li></ol></li><li>重要进展<ol><li>相关进展1</li><li>相关进展2</li></ol></li></ol><h3 id="id-01模板-标题为【姓名-xxx年xxx月xxx日】-【下周工作计划】">【下周工作计划】</h3><ol><li>item1</li><li>item2</li><li>item3</li></ol><h3 id="id-01模板-标题为【姓名-xxx年xxx月xxx日】-【遇到的问题和需要的支持】">【遇到的问题和需要的支持】</h3><ol><li>问题或风险1</li><li>问题或风险2</li></ol><h3 id="id-01模板-标题为【姓名-xxx年xxx月xxx日】-【学习与反思】">【学习与反思】</h3><p><br></p>`,
  _injectDom: _ => {
    const toolbar = _qs('#rte-toolbar .aui-toolbar2-primary.toolbar-primary')
    const dom = document.createElement('ul')
    dom.className = 'aui-buttons rte-toolbar-group-task-lists'
    dom.innerHTML = `         
      <li class="toolbar-item aui-button aui-button-subtle" id="rte-button-import">
        <a class="toolbar-trigger" href="#" data-control-id="import">
          <span>导入模板</span>
        </a>
      </li>
    `
    toolbar.appendChild(dom)
  },
  _initEvent: html => {
    const iframe = _qs('#wysiwygTextarea_ifr').contentWindow
    const editor = iframe.document.getElementById('tinymce')
    _qs('#rte-button-import a').onclick = _ => editor.innerHTML = html
  },
  _inContext: _ => {
    if (!location.pathname.includes('resumedraft')) return false
    return _qs('#breadcrumbs a').toArray().find(el=>el.innerText.includes('周报'))
  },
  init: function () {
    if (!this._inContext()) return
    this._injectDom()
    this._initEvent(this._data)
  }
}
