const gitlab = {
  _initFileList: function (arr) {
    const dom = _cE('ul').class('projTree-content')
    let inner = ''
    arr.forEach(el=>{
      if (/fa-folder/.test(el.child().class())) {
        el.child('a')
          .data('src', el.child('a').attrs('href'))
          .attrs('href', 'javascript:void(0);')
          .child().addClass('isFolder')
      } 
      inner += `<li>${el.html()}</li>`
    })
    
    return dom.html(inner)
  },
  // currNode using for append
  // parentSrc using for get parentPage html
  // currSrc using for find parent in parents
  _initParentNode: function (currNode, parentSrc, currSrc) {
    const root = _qs('.projTree-view')
    if (!parentSrc) return root.appendChild(currNode)

    const _this = this
    _ajax({
      url: parentSrc,
      dataType: 'html',
      success: function (res) {
        const doc = _cE('document').html(res)
        const grandParent = doc.querySelector('.breadcrumb > li:nth-last-child(3) a')

        const trs = /<tr([\w\W]*)<\/tr>/.exec(res)[0]
        const table = _cE('table').html(trs).hide().attrs('id', 'temporary')
        _qs('body').appendChild(table)

        const data = _this._initData('#temporary td:first-child')
        const elders = _this._initFileList(data)
        const parent = elders.children.toArray().find(el=>el.child('a').data('src') === currSrc)

        parent.appendChild(currNode)
        _this._initParentNode(elders, grandParent && grandParent.href, parentSrc)
        _qs('body').removeChild(table)
      }
    })
  },
  _initTreeWrapper: function () {
    const dom = _cE('div').class('projTree')
    const inner = _ => {
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
    _qs('body').appendChild(dom.html(inner()))
  },
  // find parent href using by breadcrumb
  _findParentHref: _ => {
    return _qs('.breadcrumb > li:nth-last-child(3) a').href
  },
  _initData: el => {
    return _qs(el).toArray().filter(el=> el.child('i')).map(el=>el.cloneNode(true))
  },
  _initDom: function () {
    this._initTreeWrapper()
    const currNode = this._initFileList(this._initData('#tree-slider td:first-child'))
    this._initParentNode(currNode, this._findParentHref(), location.href)
  },
  _initCss: _ => {
    const style = _cE('style')
    const inner = _ => {
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
    _qs('head').appendChild(style.html(inner()))
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
          const inner = /<tr([\w\W]*)<\/tr>/.exec(res)[0]
          const table = _cE('table')
          table.html(inner).hide().attrs('id', 'temporary')
          _qs('body').appendChild(table)
          const data = _this._initData('#temporary td:first-child')
          const li = target.parent('li')
          let ul = li.child('ul')
          ul = ul ? ul : li.appendChild(_this._initFileList(data)).hide()
          ul.isHide() && ul.show() || ul.hide()
          _qs('body').removeChild(table)
        }
      })
    }
  },
  _inContext: _ => location.hostname === 'code.vipkid.com.cn',
  init: function () {
    if (!this._inContext()) return
    this._initDom()
    this._initCss()
    this._initEvent()
  }
}
