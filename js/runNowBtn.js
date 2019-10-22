// 集成服务 => 服务方法 => kpi流程发起 => 立即运行
const runNowBtn = {
  _data: {
    host: '',
    methodId () {
      return this.host[0] === 't' ? 'd3276585-b107-4004-9d77-90b0a8fd0ef0' : '56b1cd74-a447-4a63-b13e-e516112a1957'
    },
    api () {
      return `http://${this.host}/Ins/BizSvcMethod/ExecBizSvcMethod/`
    },
  },
  _injectDom: function (doc) {
    const dom = doc.createElement('a')
    dom.id = 'runNow'
    dom.className = 'btn mini purple thickbox'
    dom.href = 'javascript:void(0)'
    dom.innerText = '立即运行'
    const trs = _qs('#mainForm table tr', doc)
    const index = Node2Arr(trs).findIndex(el=>el.children[1].innerText === 'KPI_流程发起')
    trs[index].children[4].appendChild(dom)
  },
  _initEvent: function (doc) {
    const _this = this
    _qs('#runNow', doc).onclick = _ => {
      const fd = new FormData()
      fd.append('methodId', _this._data.methodId())
      fd.append('paramsJson', JSON.stringify([{paramName: '1', paramValue: '1'}]))

      _ajax({
        url: _this._data.api() + _this._data.methodId(),
        type: 'POST',
        data: fd,
        success: function (res) {
          console.log(res[0].execResult)
        }
      })
    }
  },
  _inContext: _ => location.pathname === '/Sys/auth/Index' && /t|u/.test(location.hostname[0]),
  _initDependency: function () {
    const _this = this
    _qs('#sideMenu').onclick = e => {
      if (e.target.innerText !== '服务方法') return
      const iframes = _qs('.tab-content iframe')
      const index = iframes.toArray().findIndex(el=>el.src.includes('BizSvcCategory'))
      const targetIframe = iframes[index]
      targetIframe.onload = _ => {
        const win = targetIframe.contentWindow
        _this._data.host = win.location.host
        _this._injectDom(win.document)
        _this._initEvent(win.document)
      }
    }
  },
  init: function () {
    if (!this._inContext()) return
    this._initDependency()
  }
}
