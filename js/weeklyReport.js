// weekly report template
const tempUrl = 'http://wiki.vipkid.com.cn/pages/viewpage.action?pageId=81139554'
// last report
const lastReportSrc = (parentId, id) => {
  return `http://wiki.vipkid.com.cn/plugins/pagetree/naturalchildren.action
    ?decorator=none&excerpt=false&sort=position&reverse=false&disableLinks=false
    &expandCurrent=true&hasRoot=true&pageId=83116350&treeId=0&startDepth=0&mobile=false
    &ancestors=${parentId}&ancestors=81139552&ancestors=83116350&treePageId=${id}`
}

// 创建周报 => 导入模板、预览上周周报、快速标题、周报定时提醒(不在此做)
const weeklyReport = {
  // 快速标题
  _autoCreateTitle: _ => {
    const title = _qs('#content-title')
    const date = new Date()
    const offset = [null, 4, 3, 2, 1, 0, 6, 5]
    date.setDate(date.getDate() + offset[date.getDay()])
    const name = _qs('#breadcrumbs li:last-child a').txt()
    const input = `${name}-${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    title.value = input
  },
   // 导入模板、预览上周周报
  _importReportTemp: _ => {
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
  _initDom: function () {
    this._autoCreateTitle()
    this._importReportTemp()
  },
  _initEvent: function () {
    const editor = _qs('#tinymce', _qs('#wysiwygTextarea_ifr').contentWindow.document)
    _qs('#rte-button-import a').onclick = _ => {
      _wormhole(tempUrl, doc => editor.innerHTML = _qs('#main-content', doc).innerHTML)
    }
    _qs('#rte-button-view a').onclick = _ => {
      const lastReport = _qs('#lastReport')
      const toogle = _qs('#rte-button-view span')
      if (!lastReport) {
        const breadcrumbs = _qs('#breadcrumbs li').toArray().reverse()
        const pageId = /=(\d+)/.exec(breadcrumbs[0].child('a'))[1]
        const parentPageId = /=(\d+)/.exec(breadcrumbs[1].child('a'))[1]
        const src = lastReportSrc(parentPageId, pageId).replace(/\s/g, '')
        
        _wormhole(src)
        .then(doc => {
          // find list of pages under the current employee
          const reports = _qs('ul ul ul ul a', doc).toArray()
          const history = reports.find(el=>el.txt().includes('历史'))
          console.log(history, '------history----')
          console.log(reports[reports.length - 1], '------last----')
          if (!history) {
            const lastSrc = reports[reports.length - 1].href
            _wormhole(lastSrc)
            .then(doc2 => {
              const content = _qs('#main-content', doc2).attr('id', 'lastReport').addClass('lastReport')
              _qs('#rte').addClass('lastReportExist')
              _qs('#wysiwyg').appendChild(content)
              toogle.txt('隐藏上周周报')
            })
          } else {

          }
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
  _inContext: _ => _qs('#breadcrumbs a').toArray().find(el=>el.txt().includes('周报')),
  init: function () {
    if (!this._inContext()) return
    this._initCss()
    this._initDom()
    this._initEvent()
  }
}

window.onload = _ => {
  weeklyReport.init()
}