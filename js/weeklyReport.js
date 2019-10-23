// 创建周报 => 导入模板、导入上周周报(暂时不做)、快速标题、周报定时提醒(不在此做)
const weeklyReport = {
  _data: {
    tempUrl: 'http://wiki.vipkid.com.cn/pages/viewpage.action?pageId=81139554'
  },
  // 快速标题
  _autoCreateTitle: _ => {
    const title = _qs('#content-title')
    const date = new Date()
    date.setDate(date.getDate() + Math.abs(date.getDay() - 5))
    const name = _qs('#breadcrumbs li:last-child a').innerText
    const input = `${name}-${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    title.value = input
  },
   // 导入模板、导入上周周报
  _importReportTemp: _ => {
    const toolbar = _qs('.aui-toolbar2-primary.toolbar-primary')
    const dom = _cE('ul')
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
  _injectDom: function () {
    this._autoCreateTitle()
    this._importReportTemp()
  },
  _initEvent: function () {
    const editor = _qs.bind(_qs('#wysiwygTextarea_ifr').contentWindow)('#tinymce')
    _qs('#rte-button-import a').onclick = _ => this._initDependency(html => editor.innerHTML = html)
  },
  _inContext: _ => {
    if (!location.pathname.includes('resumedraft')) return false
    return _qs('#breadcrumbs a').toArray().find(el=>el.innerText.includes('周报'))
  },
  _initDependency: function (cb) {
    const iframe = _cE('iframe')
    iframe.src = this._data.tempUrl
    iframe.style.display = 'none'
    document.body.appendChild(iframe)
    iframe.onload = _ => {
      cb(_qs.bind(iframe.contentWindow)('#main-content').innerHTML)
      document.body.removeChild(iframe)
    }
  },
  init: function () {
    if (!this._inContext()) return
    this._injectDom()
    this._initEvent()
  }
}
