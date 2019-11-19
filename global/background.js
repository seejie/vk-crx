// check version
const checkVersion = _ => {
  const url = 'https://code.vipkid.com.cn/liusijie/vk-chrome-extension/raw/master/manifest.json'
  _wormhole(url).then(doc => {
    const remoteV = JSON.parse(_qs('body', doc).innerText).version
    const currV = chrome.runtime.getManifest().version
    chrome.browserAction.setBadgeText({text: remoteV === currV ? '' : 'New!'})
    chrome.browserAction.setBadgeBackgroundColor({color: remoteV === currV ? [0, 0, 0, 0] : [255, 0, 0, 255]})
    _setConfig({newV: remoteV !== currV})
  })
}

let reportTimer
// reprot notifier
const reportNotify = ({week, freq, clock}) => {
  if (new Date().getDay() !== week) return
  const time2WriteReport = _ => {
    const notifyId = 'reportNotify'
    chrome.notifications.clear(notifyId, _ => {
      chrome.notifications.create(notifyId, {
        type: 'basic',
        iconUrl: 'logo.png',
        title: 'ヾ(◍°∇°◍)ﾉﾞ',
        message: '工作辛苦了，今天是周五，记得写周报哦！',
        buttons: [{
          title: '30分钟后再提示'
        },{
          title: '60分钟后再提示'
        }]
      })
      chrome.notifications.onClicked.addListener(_ => {
        window.open('http://wiki.vipkid.com.cn/pages/viewpage.action?pageId=81141120')
      })
      chrome.notifications.onButtonClicked.addListener((id, index) => {
        const time = index ? 60 : 30
        clearTimeout(reportTimer)
        reportTimer = setTimeout(time2WriteReport, time * 60 * 1000)
      })
      chrome.notifications.onClosed.addListener(_ => {
        clearTimeout(reportTimer)
      })
    })
  }

  const timing = time => {
    const now = new Date(time)
    const hour = now.getHours()
    const minute = now.getMinutes()
    if (now.getDay() === week && hour < 21) {
      const timer = new Date(time)
      timer.setSeconds(0)
      if (minute < 30) {
        timer.setMinutes(30)
      } else {
        timer.setMinutes(0)
        timer.setHours(hour >= clock ? hour + 1 : clock)
      }
      
      reportTimer = setTimeout(_ => {
        time2WriteReport()
        timer.setMinutes(timer.getMinutes(freq - 1))
        timing(timer)
      }, timer - now)
    }
  }

  timing(new Date())
}

// get auth from the cookie
const getAuth = _ => {
  return new Promise((resolve, reject) => {
    chrome.cookies.getAll({domain: 'vipkid-inc.com'}, function(cookies) { 
      const auth = cookies.find(el=>el.domain === '.vipkid-inc.com' && el.name === 'VIPKIDITSYSTEMAUTHORIZATION')
      resolve(auth)
    })
  })
}

// find last monthly calendar
const findCalendars = pageNum => {
  getAuth().then(auth => {
    if (!auth) return
    _ajax({
      url: `https://api.vipkid-inc.com/portal/api/cmsDirectory/getValidCntByClmId?pageNum=${pageNum}&pageSize=5&columnId=122&pageId=1&pagePart=C2`,
      headers: {Authorization: auth.value},
      success: function (res) {
        const arr = res.data.list
        const calendar = arr.find(el=>el.title.includes('台历'))
        if (calendar) {
          const path = calendar.contentConfigList[0].contentConfigValueList[0].text01
          _setConfig({calendarImg: path})
          _sendMsg({whoami: `newtab:${path}`})
        } else {
          findCalendars(++pageNum)
        }
      }
    })
  })
}

// notify
const notify = msg => {
  const notifyId = 'notify'
  chrome.notifications.clear(notifyId, _ => {
    chrome.notifications.create(notifyId, {
      type: 'basic',
      iconUrl: 'logo.png',
      title: '提示',
      message: msg
    })
  })
}

// contextMenus
const initContextMenus = _ => {
  const createMenus = key => {
    return chrome.contextMenus.create({
      title: `向${key}插入一行`, 
      contexts: ['selection'], 
      onclick: function({pageUrl, selectionText}){
        _queryTab({url: pageUrl}, tabs => _sendMsg2tab(tabs[0].id, `${key}:${selectionText}`))
      }
    })
  }
  chrome.contextMenus.removeAll(function(){
    createMenus("上")
    createMenus("下")
    createMenus("后")
  })
}

// message hub
const messageHub = _ => {
  _runtimeMsg(function(request) {
    const [whoami, params] = request.whoami.split(':')
    switch (whoami) {
      case 'notify':
        return notify(params)
      case 'contMenus':
        return initContextMenus()
      case 'checkV':
        return checkVersion()
    }
  })
}

// distribute tasks
const storageHub = _ => {
  chrome.storage.onChanged.addListener(function(changes){
    const keys = Object.keys(changes)
    keys.includes('reportConfig') && reportNotify(changes.reportConfig.newValue)
    keys.includes('newV') && _sendMsg({whoami: `popup:${changes.newV.newValue}`})
    keys.includes('allowWeeklyReport') && handleStatusChanged(changes.allowWeeklyReport.newValue)
    keys.includes('allowGitlab') && handleStatusChanged(changes.allowGitlab.newValue)
    keys.includes('allowNewtab') && newTabStatusChanged(changes.allowNewtab.newValue)
  })
}

// event hub
const eventHub = _ => {
  // todo update
  chrome.runtime.onUpdateAvailable.addListener(function(e){
    console.log(e, '-----e-----')
    // chrome.runtime.reload()
  })

  // todo update
  chrome.runtime.requestUpdateCheck(function (d){
    console.log(d, '-----d-----')
  })

  // todo 
  // chrome.management.launchApp(string id, function callback)
}

// checkeck active status
const checkActive = _ => {
  const activeToggle = _ => {
    _queryTab(null, tab => {
      const currTab = tab[0].url
      const scripts = chrome.runtime.getManifest().content_scripts.map(el=>el.matches).flat()
      const exist = scripts.find(el=>new RegExp(el).test(currTab))
      chrome.browserAction.setIcon({path: {'19': exist ? 'logo3.png' : 'logo2.png'}})
    })
  }
  chrome.tabs.onActiveChanged.addListener(activeToggle)
  chrome.tabs.onUpdated.addListener((id, info) => info.status === 'complete' && activeToggle())
}

// new tab
const newtab = _ => {
  const defaultUrl = 'chrome://newtab/'
  const overrideUrl = chrome.runtime.getURL('/pages/newtab.html')
  chrome.tabs.onCreated.addListener(function(){
    _queryTab(null, function(info) {
      if (info[0].url !== defaultUrl) return
      _getConfig(null, ({allowNewtab, calendarImg}) => {
        const url = allowNewtab ? overrideUrl : defaultUrl
        if (!allowNewtab) return
        chrome.tabs.update(info[0].id, {url})
        !calendarImg && findCalendars(1)
      })
    })
  })
}

// newTabStatusChanged
const newTabStatusChanged = bool => {
  _queryTab(null, info => {
    const tab = info[0]
    const newtab = ['chrome://newtab/', chrome.runtime.getURL('/pages/newtab.html')]
    if (!newtab.includes(tab.url)) return
    chrome.tabs.update(tab.id, {url: newtab[+bool]})
  })
}

// reportStatusChanged、gitlabStatusChanged
const handleStatusChanged = val => _queryTab(null, info => _sendMsg2tab(info[0].id, val))

let globalTimer 
const initReportNotify = _ => {
  _getConfig('reportConfig', info => {
    if (info) return reportNotify(info)
    _setConfig({
      reportConfig: {
        week: 5,
        freq: 30,
        clock: 17
      }
    })
  })
  clearTimeout(globalTimer)
  globalTimer = setTimeout(initReportNotify, 24 * 3600 * 1000)
}

// start form here
const run = (_ => {
  checkVersion()
  messageHub()
  storageHub()
  // eventHub()
  initReportNotify()
  // checkActive()
  newtab()
})()

