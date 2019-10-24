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
  _injectDom: function (win) {
    const dom = _cE('a')
      .attrs('id', 'runNow')
      .class('btn mini purple thickbox')
      // .attrs('href', 'javascript:void(0)')
      .text('立即运行')
    const trs = _qs.bind(win)('#mainForm table tr')
    const index = Node2Arr(trs).findIndex(el=>el.child(1).text() === 'KPI_流程发起')
    trs[index].child(4).appendChild(dom)
  },
  _initEvent: function (win) {
    _qs.bind(win)('#runNow').onclick = _ => {
      const fd = new FormData()
      fd.append('methodId', this._data.methodId())
      fd.append('paramsJson', JSON.stringify([{paramName: '1', paramValue: '1'}]))

      _ajax({
        url: this._data.api() + this._data.methodId(),
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
    _qs('#sideMenu').onclick = e => {
      if (e.target.text() !== '服务方法') return
      const iframes = _qs('.tab-content iframe')
      const index = iframes.toArray().findIndex(el=>el.src.includes('BizSvcCategory'))
      const iframe = iframes[index]
      iframe.onload = _ => {
        const win = iframe.contentWindow
        this._data.host = win.location.host
        this._injectDom(win)
        this._initEvent(win)
      }
    }
  },
  init: function () {
    if (!this._inContext()) return
    this._initDependency()
  }
}
