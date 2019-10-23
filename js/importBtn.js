// 创建周报 => 导入模板
const importBtn = {
  _data: {
    path: 'http://wiki.vipkid.com.cn/pages/viewpage.action?pageId=81139554',
    html: ''
  },
  _injectDom: function () {
    const toolbar = _qs('#rte-toolbar .aui-toolbar2-primary.toolbar-primary')
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
  _initEvent: function () {
    const editor = _qs.bind(_qs('#wysiwygTextarea_ifr').contentWindow)('#tinymce')
    _qs('#rte-button-import a').onclick = _ => editor.innerHTML = this._data.html
  },
  _inContext: _ => {
    if (!location.pathname.includes('resumedraft')) return false
    return _qs('#breadcrumbs a').toArray().find(el=>el.innerText.includes('周报'))
  },
  _initDependency: function () {
    const iframe = _cE('iframe')
    iframe.src = this._data.path
    iframe.style.display = 'none'
    document.body.appendChild(iframe)
    iframe.onload = _ => {
      this._data.html = _qs.bind(iframe.contentWindow)('#main-content').innerHTML
      document.body.removeChild(iframe)
      this._injectDom()
      this._initEvent()
    }
  },
  init: function () {
    if (!this._inContext()) return
    this._initDependency()
  }
}
