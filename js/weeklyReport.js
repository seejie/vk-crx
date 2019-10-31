// weekly report template
const tempUrl = 'http://wiki.vipkid.com.cn/pages/viewpage.action?pageId=81139554'
// api for search last report
const lastReportSrc = (idChain, id) => {
  const imcPageId = '83116350'
  const reprotPageId = '81139552'
  return `http://wiki.vipkid.com.cn/plugins/pagetree/naturalchildren.action
    ?decorator=none&excerpt=false&sort=position&reverse=false&disableLinks=false
    &expandCurrent=true&hasRoot=true&pageId=83116350&treeId=0&startDepth=0&mobile=false
    &${idChain}&ancestors=${reprotPageId}&ancestors=${imcPageId}&treePageId=${id}`
}

// 创建周报 => 导入模板、预览上周周报、快速标题、周报定时提醒(不在此做)
const weeklyReport = {
  // auto create title
  _autoCreateTitle: _ => {
    const title = _qs('#content-title')
    const date = new Date()
    const offset = [null, 4, 3, 2, 1, 0, 6, 5]
    date.setDate(date.getDate() + offset[date.getDay()])
    const name = _qs('#breadcrumbs li:last-child a').txt()
    const input = `${name}-${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
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
    toolbar.appendChild(_2dom(inner()))
  },
  _initEvent: function () {
    const editor = _qs('#tinymce', _qs('#wysiwygTextarea_ifr').contentWindow.document)
    _qs('#rte-button-import a').onclick = _ => {
      this._autoCreateTitle()
      _wormhole(tempUrl).then(doc => editor.innerHTML = _qs('#main-content', doc).innerHTML)
    }
    _qs('#rte-button-view a').onclick = _ => {
      const lastReport = _qs('#lastReport')
      const toogle = _qs('#rte-button-view span')
      if (!lastReport) {
        chrome.storage.local.get('lastReportRealSrc', storage => {
          _wormhole(storage.lastReportRealSrc)
          .then(doc => {
            const content = _qs('#main-content', doc).attr('id', 'lastReport').addClass('lastReport')
            _qs('#rte').addClass('lastReportExist')
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
    let reports
    if (hasHistoryNode) {
      reports = list[4].children.toArray()
    } else {
      reports = list[4].children.toArray().filter(el => {
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
      chrome.storage.local.set({lastReportRealSrc: reportSrc})
      if (!hasHistoryNode) return

      // if has history node need more times
      const relReportSrc = src.replace(/treePageId=(\d+)/.exec(src)[1], /\d+/.exec(reportSrc)[0])
        .replace('mobile=false&', `mobile=false&ancestors=${/treePageId=(\d+)/.exec(src)[1]}&`)

      _wormhole(relReportSrc)
      .then(doc2 => {
        const lastUl2 = _qs('ul', doc2).toArray().reverse()[0]
        const reportSrc2 = _qs('a', lastUl2).toArray().reverse()[0].href
        chrome.storage.local.set({lastReportRealSrc: reportSrc2})
      })
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
      const sonUl = _qs('ul', currLi)
      const links = _qs('a', sonUl).toArray()
      const history = links.find(el => /归档周报|周报归档|历史周报/.test(el.txt()))
      // has history reports set
      if (history) {
        this._findLastMounthLastReport(0, true)
      } else {
        // current month has report
        if (sonUl) {
          const reports = _qs('a', sonUl)
          const reportSrc = reports.href || reports.toArray().reverse()[0].href
          chrome.storage.local.set({lastReportRealSrc: reportSrc})
        } else {
          const fatherUl = currLi.parent('ul')
          if (fatherUl.childElementCount <= 1) return
          this._findLastMounthLastReport(0)
        }
      }
    }
    // edit
    _qs('#editPageLink').onclick = _ => {
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
          chrome.storage.local.set({lastReportRealSrc: reportSrc})
        } 
      } 
    }
  },
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
  weeklyReport.init()
  // when user press the edit button
  // from view page to edit page is not really jump to another page
  // it is just change some doms and change location path only
  // and there is no '#'(symbol) in path 
  // so it means event 'onhashchange' its not useful in this case
  // observe body node for determine page was changed
  const observer = new MutationObserver(_ => {
    if (!location.href.includes('resumedraft')) return
    weeklyReport._initDom()
    weeklyReport._initEvent()
    observer.disconnect()
  })
  observer.observe(_qs('body'), {childList: true})
}
