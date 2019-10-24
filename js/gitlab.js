const gitlab = {
  _initFileList: function (arr) {
    const dom = _cE('ul').class('projTree-content')
    let html = ''
    arr.forEach(el=>{
      if (/fa-folder/.test(el.child().class())) {
        el.child('a')
          .data('src', el.child('a').attrs('href'))
          .attrs('href', 'javascript:void(0);')
          .child().addClass('isFolder')
      } 
      html += `<li>${el.html()}</li>`
    })
    
    return dom.html(html)
  },
  _initDom: function () {
    const dom = _cE('div').class('projTree')
    const html = _ => {
      return `
        <div class="projTree-header">
          <span>{projectName}</span>
          <span> / </span>
          <span>{branchName}</span>
        </div>
        <div class="projTree-view">
        </div>
      `
    }
    _qs('body').appendChild(dom.html(html()))
    const data = this._initData('#tree-slider td:first-child')
    _qs('.projTree-view').appendChild(this._initFileList(data))
  },
  _initCss: _ => {
    const style = _cE('style')
    const html = _ => {
      return `
        .projTree * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        .projTree{
          position: fixed;
          top: 0;
          left: 0;
          height: 100%;
          width: 232px;
          background: #ffffff;
          z-index: 1000000001;
          border-right: 1px solid #e5e5e5;
        }
        .projTree-header{
          height: 51px;
          background: #fafafa;
          border-bottom: 1px solid #e5e5e5;
          line-height: 51px;
          padding: 0 10px !important;
        }
        .projTree-view{
          padding: 10px;
          height: calc(100% - 52px);
          overflow: scroll;
        }
        .projTree-content{
          width: 100%;
          list-style: none;
        }
        .projTree-content .str-truncated {
          width: 100%;
        }
        .projTree-content .projTree-content{
          padding-left: 22px;
        }
      `
    }
    _qs('head').appendChild(style.html(html()))
  },
  _initEvent: function () {
    _qs('.projTree').onclick = e => {
      const target = e.target
      if (!target.class().includes('isFolder')) return
      const src = target.parent().data('src')
      const _this = this
      _ajax({
        url: src,
        dataType: 'html',
        success: function (res) {
          const html = /<tr([\w\W]*)<\/tr>/.exec(res)[0]
          const table = _cE('table')
          table.html(html).hide().attrs('id', 'temporary')
          _qs('body').appendChild(table)
          const data = _this._initData('#temporary td:first-child')
          target.parent('li').appendChild(_this._initFileList(data))
          _qs('body').removeChild(table)
        }
      })
    }
  },
  _initData: el => {
    return _qs(el).toArray().filter(el=>el.children.length > 1).map(el=>el.cloneNode(true))
  },
  _inContext: _ => location.hostname === 'code.vipkid.com.cn',
  init: function () {
    if (!this._inContext()) return
    this._initDom()
    this._initCss()
    this._initEvent()
  }
}
