// 创建周报 => 导入模板、预览上周周报(暂时不做)、快速标题、周报定时提醒(不在此做)
const weeklyReport = {
  _data: {
    tempUrl: 'http://wiki.vipkid.com.cn/pages/viewpage.action?pageId=81139554'
  },
  // 快速标题
  _autoCreateTitle: _ => {
    const title = _qs('#content-title')
    const date = new Date()
    const offset = [4, 3, 2, 1, 0, 6, 5]
    date.setDate(date.getDate() + offset[date.getDay()])
    const name = _qs('#breadcrumbs li:last-child a').txt()
    const input = `${name}-${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    title.value = input
  },
   // 导入模板、预览上周周报
  _importReportTemp: _ => {
    const toolbar = _qs('.aui-toolbar2-primary.toolbar-primary')
    const dom = _cE('ul')
      .class('aui-buttons rte-toolbar-group-task-lists')
      .html( `         
        <li class="toolbar-item aui-button aui-button-subtle" id="rte-button-import">
          <a class="toolbar-trigger" href="#" data-control-id="import">
            <span>导入模板</span>
          </a>
        </li>
      `)
    toolbar.appendChild(dom)
  },
  _injectDom: function () {
    this._autoCreateTitle()
    this._importReportTemp()
  },
  _initEvent: function () {
    const editor = _qs.bind(_qs('#wysiwygTextarea_ifr').contentWindow)('#tinymce')
    _qs('#rte-button-import a').onclick = _ => this._initDependency(inner => editor.innerHTML = inner)
  },
  _inContext: _ => {
    if (!location.pathname.includes('resumedraft')) return false
    return _qs('#breadcrumbs a').toArray().find(el=>el.txt().includes('周报'))
  },
  _initDependency: function (cb) {
    _blackHole(this._data.tempUrl, (win, destroy) => {
      cb(_qs.bind(win)('#main-content').innerHTML)
      destroy()
    })
  },
  init: function () {
    if (!this._inContext()) return
    this._injectDom()
    this._initEvent()
  }
}
