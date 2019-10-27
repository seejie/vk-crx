const gitlab = {
  _initFileList: function (arr) {
    if (!arr) return
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
    if (!parentSrc) {
      root.innerHTML = ''
      root.appendChild(currNode)
      const selectedNode = _qs(`.projTree-content a[href="${location.pathname}"]`)
      selectedNode && selectedNode.parent('li').class('actived')
      return
    } 

    _wormhole(parentSrc, doc => {
      const grandParent = _qs('.breadcrumb > li:nth-last-child(3) a', doc)
      const td = _qs('#tree-slider td:first-child', doc)
      const data = this._initData(td)
      const elders = this._initFileList(data)
      const parent = elders.children.toArray().find(el=>el.child('a').data('src') === currSrc)

      currNode && parent && parent.appendChild(currNode)
      this._initParentNode(elders, grandParent && grandParent.href, parentSrc)
    })
  },
  // find parent href using by breadcrumb
  _findParentHref: isLeafNode => {
    const parent = _qs(`.breadcrumb > li:nth-last-child(${isLeafNode ? 2 : 3}) a`)
    return parent && parent.href
  },
  _initData: el => {
    return el && el.toArray().filter(el=> el.child('i')).map(el=>el.cloneNode(true))
  },
  _initDom: function () {
    const dom = _cE('div').class('projTree-wrapper')
    const inner = _ => {
      return `
          <div class="projTree-header">
            <span>${_qs('.project-item-select-holder').txt()}</span>
            <span> / </span>
            <span>${_qs('.dropdown-toggle-text').txt()}</span>
          </div>
          <div class="projTree-view">
            <div>加载中<span class="dotload">...</span></div>
          </div>
          <div class="projTree-footer">🤪 hava a nice coding</div>
      `
    } 
    dom.html(inner())
    _qs('.projTree').insertBefore(dom, _qs('.projTree-switchBtn'))
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
          display: flex;
          height: 100%;
          background: transparent;
          z-index: 1000000001;
          overflow: hidden;
          transition: left 0.5s ease 0s;
        }
        .projTree-wrapper{
          height: 100%;
          background:#fff;
          width: 0;
          overflow: hidden;
          transition: width 0.3s ease-in 0s;
        }
        .projTree-header{
          height: 51px;
          background: #fafafa;
          border-right: 1px solid #e5e5e5;
          border-bottom: 1px solid #e5e5e5;
          line-height: 51px;
          padding: 0 10px !important;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .projTree-view{
          padding: 10px;
          height: calc(100% - 52px);
          overflow: scroll;
          border-right: 1px solid #e5e5e5;
        }
        .projTree-content{
          width: 100%;
          list-style: none;
        }
        .projTree-content .str-truncated {
          width: 100%;
        }
        .projTree-content .str-truncated:hover {
          background: #f5f5f5;
        }
        .projTree-content li.actived .str-truncated{
          color: red;
          text-decoration: underline;
        }
        .projTree-content .projTree-content{
          padding-left: 22px;
        }
        .dotload {
          display: inline-block;
          width: 3ch;
          text-indent: -1ch;
          vertical-align: bottom;
          overflow: hidden;
          animation: dot 1s infinite step-start both;
          font-family: Consolas, Monaco, monospace;
        }
        @keyframes dot {
          33% { text-indent: 0; }
          66% { text-indent: -2ch; }
        }
        .projTree-footer{
          position: absolute;
          bottom: 0;
          width: 232px;
          background-color: #fafafa;
          padding: 5px 10px;
          text-align: center;
          border-right: 1px solid #e5e5e5;
        }
        .projTree-switchBtn{
          cursor: pointer;
          height: 100px;
          margin: auto;
          text-align: center;
          transform: rotate(-180deg);
          writing-mode: tb-rl;
          background-color: #f2f5f7;
          padding: 8px 0;
          border: 1px solid #e0e4e7;
          border-right: 0;
          box-shadow: rgba(118, 118, 118, 0.11) 2px 0px 5px 0px;
        }
      `
    }
    _qs('head').appendChild(style.html(inner()))
  },
  _initEvent: function () {
    _qs('.projTree').onmouseleave = e => {
      if (e.target.class() !== 'projTree') return
      _qs('.projTree-wrapper').style.width = '0'
    }
    _qs('.projTree').onclick = e => {
      const target = e.target
      if (!target.class().includes('isFolder')) return
      const src = target.parent('a').data('src')

      _wormhole(src, doc => {
        const td = _qs('#tree-slider td:first-child', doc)
        const data = this._initData(td)
        const li = target.parent('li')
        let ul = li.child('ul')
        ul = ul ? ul : li.appendChild(this._initFileList(data)).hide()
        ul.isHide() && ul.show() || ul.hide()
      })
    }
  },
  _beforeCreated: function () {
    const btn = _cE('div').class('projTree-switchBtn').txt(`What's Up`)
    const tree = _cE('div').class('projTree')
    _qs('body').appendChild(tree)
    tree.appendChild(btn)

    _qs('.projTree').onmouseover = e => {
      if (e.target.class() !== 'projTree-switchBtn') return
      _qs('.projTree-wrapper').style.width = '232px'
      const td = _qs('#tree-slider td:first-child')
      const currNode = this._initFileList(this._initData(td))
      this._initParentNode(currNode, this._findParentHref(!currNode), location.href)
    }
  },
  _inContext: _ => {
    if (_qs('li.active').length !== 3) return false
    return /Home|Files/i.test(_qs('li.active')[2].child('a').txt())
  },
  init: function () {
    if (!this._inContext()) return
    this._initCss()
    this._beforeCreated()
    this._initDom()
    this._initEvent()
  }
}

gitlab.init()