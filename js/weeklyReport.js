// weekly report template
const tempUrl = bool => bool 
  ? 'http://wiki.vipkid.com.cn/pages/viewpage.action?pageId=76445016' 
  : 'http://wiki.vipkid.com.cn/pages/viewpage.action?pageId=81139554'
  
// api for search last report
const lastReportSrc = (idChain, id, isQa) => {
  const groupPageId = isQa ? '4195397' : '83116350'
  const reprotPageId = isQa ? '4195562' : '81139552'
  return `http://wiki.vipkid.com.cn/plugins/pagetree/naturalchildren.action
    ?decorator=none&excerpt=false&sort=position&reverse=false&disableLinks=false
    &expandCurrent=true&hasRoot=true&pageId=${groupPageId}&treeId=0&startDepth=0&mobile=false
    &${idChain}&ancestors=${reprotPageId}&ancestors=${groupPageId}&treePageId=${id}`
}

// 创建周报 => 导入模板、预览上周周报、快速标题、周报定时提醒(不在此做)
const weeklyReport = {
  // auto create title
  _autoCreateTitle: function () {
    const title = _qs('#content-title')
    if (this._isTesterGroup()) return title.value = this._currUserName() + ' ' + _qs('#breadcrumbs a').toArray().reverse()[0].txt().replace(/[\u4E00-\u9FA5]*/, '')
    const date = new Date()
    const offset = [null, 4, 3, 2, 1, 0, 6, 5]
    date.setDate(date.getDate() + offset[date.getDay()])
    const input = `${this._currUserName()}-${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    title.value = input
  },
  // import template && preview of report
  _initDom: _ => {
    const toolbar = _qs('.aui-toolbar2-primary.toolbar-primary')
    const inner = _ => {
      return`
        <ul class="aui-buttons rte-toolbar-group-task-lists">
          <li class="toolbar-item aui-button aui-button-subtle" id="rte-button-import">
          <a class="toolbar-trigger" href="#" data-control-id="import">
            <span>导入模板</span>
          </a>
          </li>
          <li class="toolbar-item aui-button aui-button-subtle" id="rte-button-view">
            <a class="toolbar-trigger" href="#" data-control-id="view">
              <span>预览上周周报</span>
            </a>
          </li>
        </ul>
      `
    }
    if (_qs('#rte-button-import', toolbar)) return
    toolbar.appendChild(_2dom(inner()))
  },
  _initEvent: function () {
    _qs('#rte-button-import a').onclick = _ => {
      const editor = _qs('#tinymce', _qs('#wysiwygTextarea_ifr').contentWindow.document)
      if (/[\u4E00-\u9FA5]/.test(editor.innerHTML)) return _notify('文档内容不为空，不可导入')
      this._autoCreateTitle()
      _wormhole(tempUrl(this._isTesterGroup())).then(doc => editor.innerHTML = _qs('#main-content', doc).innerHTML)
    }
    _qs('#rte-button-view a').onclick = _ => {
      const lastReport = _qs('#lastReport')
      const toogle = _qs('#rte-button-view span')
      if (!lastReport) {
        _getConfig('lastReportRealSrc', src => {
          if (!src) return console.error('not fond')
          _wormhole(src)
          .then(doc => {
            const title = _qs('#title-text', doc)
            const content = _qs('#main-content', doc).attr('id', 'lastReport').addClass('lastReport')
            _qs('#rte').addClass('lastReportExist')
            content.insertBefore(title, content.child())
            _qs('#wysiwyg').appendChild(content)
            toogle.txt('隐藏上周周报')
          })
        })
      } else {
        const lastReportExist = _qs('#rte')
        if (lastReport.isHide()) {
          lastReport.show()
          lastReportExist.addClass('lastReportExist')
          toogle.txt('隐藏上周周报')
        } else {
          lastReport.hide()
          lastReportExist.class(lastReportExist.class().replace('lastReportExist', ''))
          toogle.txt('预览上周周报')
        }
      }
    }
  },
  _findLastMounthLastReport: function (idx, hasHistoryNode) {
    // editModel => find last: 1; find previous: idx + 2
    // createModel => 0
    idx = idx === undefined ? 1 : idx === 0 ? 0 : idx + 2
    const getId = el => el.attr('id').replace(/\D+/, '').replace(/-\d+/, '')        
    const list = _qs('.plugin_pagetree_children_list')
    const groupPageId = getId(list[3])
    const employeePageId = getId(list[4])
    let reports = list[4].children.toArray()
    if (hasHistoryNode) {
      reports = reports.filter(el => {
        const dom = el.child('span').child('a')
        return dom && /\d+年\d+月/.test(dom.txt())
      })
    }
    const closestBro = reports.reverse()[hasHistoryNode ? 1 : idx].children[2]
    const monthPageId = getId(closestBro)
    const idChain = `ancestors=${employeePageId}&ancestors=${groupPageId}`
    const src = lastReportSrc(idChain, monthPageId).replace(/\s/g, '')

    _wormhole(src)
    .then(doc => {
      const lastUl = _qs('ul', doc).toArray().reverse()[0]
      const reportSrc = _qs('a', lastUl).toArray().reverse()[0].href
      _setConfig({lastReportRealSrc: reportSrc})
      if (!hasHistoryNode) return

      // if has history node need more times
      const relReportSrc = src.replace(/treePageId=(\d+)/.exec(src)[1], /\d+/.exec(reportSrc)[0])
        .replace('mobile=false&', `mobile=false&ancestors=${/treePageId=(\d+)/.exec(src)[1]}&`)

      _wormhole(relReportSrc)
      .then(doc2 => {
        const lastUl2 = _qs('ul', doc2).toArray().reverse()[0]
        const reportSrc2 = _qs('a', lastUl2).toArray().reverse()[0].href
        _setConfig({lastReportRealSrc: reportSrc2})
      })
    })
  },
  _findLastMounthLastReport_Qa: function (index, dayIdx, bool) {
    const getId = el => el.attr('id').replace(/\D+/, '').replace(/-\d+/, '')
    const list = _qs('.plugin_pagetree_children_list')
    let reports = index ? list[6].children.toArray() : list[5].children.toArray()
    const closestBro = dayIdx === undefined 
      ? reports[index - 1].children[2]
      : reports[dayIdx].children[2]

    const dayPageId = getId(closestBro)
    const idChain = `ancestors=${getId(list[5])}&ancestors=${getId(list[4])}&ancestors=${getId(list[3])}`
    const src = lastReportSrc(bool ? idChain : `ancestors=${getId(list[6])}&` + idChain, dayPageId, true).replace(/\s/g, '')

    _wormhole(src)
    .then(doc => {
      const lastUl = _qs('ul', doc).toArray().reverse()[0]
      if (dayIdx === undefined ) {
        const reportSrc = _qs('a', lastUl).toArray().find(el=>el.innerText.includes(this._currUserName())).href
        _setConfig({lastReportRealSrc: reportSrc})
      } else {
        const reportSrc = _qs('a', lastUl).toArray().reverse()[0].href

        const relReportSrc = src.replace(/treePageId=(\d+)/.exec(src)[1], /\d+/.exec(reportSrc)[0])
        .replace('mobile=false&', `mobile=false&ancestors=${/treePageId=(\d+)/.exec(src)[1]}&`)

        _wormhole(relReportSrc)
        .then(doc2 => {
          const lastUl2 = _qs('ul', doc2).toArray().reverse()[0]
          const reportSrc2 = _qs('a', lastUl2).toArray().reverse()[0].href
          _setConfig({lastReportRealSrc: reportSrc2})
        })
      }
    })
  },
  _initCss: _ => {
    _injectCss(`
      .lastReport{
        float: right;
        width: calc(50% - 2rem);
        height: calc(100% - 2rem);
        padding: 1rem;
        background: #fafafa;
      }
      .lastReportExist{
        float: left;
        width: 50%;
      }
    `)
  },
  _beforeCreated: function () {
    const curr = _qs('.plugin_pagetree_children_span.plugin_pagetree_current')
    if (!curr) return
    const currLi = curr.parent('li')
    // create
    _qs('#quick-create-page-button').onclick = _ => {
      if (this._isTesterGroup()) {
        const index = currLi.parent('ul').children.toArray().findIndex(el=>el === currLi)
        if (index) {
          this._findLastMounthLastReport_Qa(index)
        } else {
          const month = currLi.parent('ul').parent('li')
          const monthIdx = month.parent('ul').children.toArray().findIndex(el=>el === month)
          if (!monthIdx) return
          this._findLastMounthLastReport_Qa(index, monthIdx - 1)
        }
        return
      }
      const underName = curr.parent('ul').parent('li').child('span').txt().includes('团队')
      if (underName) {
        this._findLastMounthLastReport(0)
        return
      }
      const sonUl = _qs('ul', currLi)
      const reports = _qs('a', sonUl)
      const history = reports.toArray().find(el => /归档周报|周报归档|历史周报/.test(el.txt()))
      // has history reports set
      if (history) {
        this._findLastMounthLastReport(0, true)
      } else {
        // current month has report
        if (sonUl) {
          const reportSrc = reports.href || reports.toArray().reverse()[0].href
          _setConfig({lastReportRealSrc: reportSrc})
        } else {
          const fatherUl = currLi.parent('ul')
          if (fatherUl.childElementCount <= 1) return
          this._findLastMounthLastReport(0)
        }
      }
    }

    // edit
    _qs('#editPageLink').onclick = _ => {
      if (this._isTesterGroup()) {
        const currFather = currLi.parent('li')
        const index = currFather.parent('ul').children.toArray().findIndex(el=>el === currFather)
        if (index) {
          this._findLastMounthLastReport_Qa(index)
        } else {
          const month = currFather.parent('ul').parent('li')
          const monthIdx = month.parent('ul').children.toArray().findIndex(el=>el === month)
          if (!monthIdx) return
          this._findLastMounthLastReport_Qa(index, monthIdx - 1, true)
        }
        return
      }
      const fatherUl = currLi.parent('ul')
      if (fatherUl.childElementCount < 1) return
      // current month hasn't report
      if (fatherUl.childElementCount === 1) {
        this._findLastMounthLastReport()
      } else {
        const brothers = fatherUl.children.toArray()
        const currIndex = brothers.findIndex(el=>el === currLi)
        if (!currIndex) {
          const month = fatherUl.parent('li')
          const employee = month.parent('ul')
          // filter all weekly report only
          const idx = employee.children.toArray().filter(el=> {
            const dom = el.child('span').child('a')
            return dom && /\d+年\d+月/.test(dom.txt())
          }).findIndex(el=>el === month)
          if (!idx) return
          this._findLastMounthLastReport(idx - 1)
        } else{
          const closestBro = brothers[currIndex - 1]
          const reportSrc = _qs('a', closestBro).href
          _setConfig({lastReportRealSrc: reportSrc})
        } 
      } 
    }
  },
  _isTesterGroup: _ => _qs('#breadcrumbs a').toArray().find(el=>el.txt().includes('测试组')),
  _currUserName: _ => /[\u4E00-\u9FA5]*/.exec(_qs('[name=ajs-current-user-fullname]').content)[0],
  _inContext: _ => _qs('#breadcrumbs a').toArray().find(el=>el.txt().includes('周报')),
  init: function () {
    if (!this._inContext()) return
    // in view page
    this._beforeCreated()
    this._initCss()
    if (!location.href.includes('resumedraft')) return
    // in create/edit page
    this._initDom()
    this._initEvent()
  }
}

window.onload = _ => {
  _getConfig('allowWeeklyReport', val => {
    if (!val) return
    weeklyReport.init()
 
    // when user press the edit button
    // from view page to edit page is not really jump to another page
    // it is just change some doms and change location path only
    // and there is no '#'(symbol) in path 
    // so it means event 'onhashchange' its not useful in this case
    // observe body node for determine page was changed
    const observer = new MutationObserver(_ => {
      document.addEventListener('click', e => {
        if (!e.target.txt().includes('编辑')) return
        weeklyReport._initDom()
        weeklyReport._initEvent()
        observer.disconnect()
      })
    })
    observer.observe(_qs('body'), {childList: true})
    if (!location.href.includes('resumedraft')) return
    _callBackground({whoami: 'contMenus'})
  })
}

// insert new list
chrome.runtime.onMessage.addListener(function(message) {
  const [position, content] = message.split(':')
  const editor = _qs('#tinymce', _qs('iframe').contentWindow.document)
  const target = [].slice.call(_qs('li', editor)).find(el=> el.firstChild && el.firstChild.textContent.includes(content))
  if (!target) return
  const current = target.nodeType === 3 ? target.parentNode : target
  const father = current.parentNode
  const index = [].slice.call(father.children).findIndex(el=>el === current)
  const nextBro = father.children[index + 1]

  if (position === '上') {
    father.insertBefore(_cE('li'), current)
  } else if (position === '下') {
    nextBro && father.insertBefore(_cE('li'), nextBro) || father.appendChild(_cE('li')) 
  } else if(position === '后') {
    const child = _qs('ol', current)
    if (child) return child.appendChild(_cE('li'))
    const ol = _cE('ol')
    ol.appendChild(_cE('li'))
    current.appendChild(ol)
  }
})
