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
  _initParentNode: function (currNode, src) {
    const root = _qs('.projTree-view')
    const father = _qs('#tree-slider tr:first-child td:first-child')
    if (!src && father.child('i')) return root.appendChild(currNode)
    const src = src || father.child('a').href
    
    const _this = this
    _ajax({
      url: src,
      dataType: 'html',
      success: function (res) {
        const html = /<tr([\w\W]*)<\/tr>/.exec(res)[0]
        const table = _cE('table').html(html).hide().attrs('id', 'temporary')
        _qs('body').appendChild(table)
        const data = _this._initData('#temporary td:first-child')
        const elders = _this._initFileList(data)
        const parent = elders.children.toArray().find(el=>el.child('a').data('src') === location.href)
        parent.appendChild(currNode)
        const grandParentSrc = parent.child('a').data('src')
        console.log(parent.child('a').data('src'), '-----2-----')
        // root.appendChild(elders)
        _this._initParentNode(parent, grandParentSrc)
      }
    })
  },
  _initCurrNode: function () {
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
    return this._initFileList(data)
  },
  _initDom: function () {
    this._initParentNode(this._initCurrNode(), false)
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
      const src = target.parent('a').data('src')
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
          const li = target.parent('li')
          // todo
          let ul = li.child('ul')
          ul = ul ? ul : li.appendChild(_this._initFileList(data)).hide()
          ul.isHide() && ul.show() || ul.hide()
          _qs('body').removeChild(table)
        }
      })
    }
  },
  _initData: el => {
    return _qs(el).toArray().filter(el=>el.child('i')).map(el=>el.cloneNode(true))
  },
  _inContext: _ => location.hostname === 'code.vipkid.com.cn',
  init: function () {
    if (!this._inContext()) return
    this._initDom()
    this._initCss()
    this._initEvent()
  }
}
