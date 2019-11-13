// todo
let calendarImg
// check version
const checkVersion = _ => {
  const url = 'https://code.vipkid.com.cn/liusijie/vk-chrome-extension/raw/master/manifest.json'
  _wormhole(url).then(doc => {
    const remoteV = JSON.parse(_qs('body', doc).innerText).version
    const currV = chrome.runtime.getManifest().version
    if (remoteV === currV) {
      chrome.browserAction.setBadgeText({text: ''})
      chrome.browserAction.setBadgeBackgroundColor({color: [0, 0, 0, 0]})
      _setConfig({newV: false})
    } else {
      chrome.browserAction.setBadgeText({text: 'New!'})
      chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]})
      _setConfig({newV: true})
    }
  })
}

// reprot notifier
const reportNotify = _ => {
  let timer
  const time2WriteReport = _ => {
    chrome.notifications.create(null, {
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
      clearTimeout(timer)
      timer = setTimeout(_ => {
        time2WriteReport()
      }, time * 60 * 1000)
    })
    chrome.notifications.onClosed.addListener(_ => {
      clearTimeout(timer)
    })
  }

  const timing = time => {
    const friday = 5
    const fiveClock = 17
    const now = new Date(time)
    const hour = now.getHours()
    const minute = now.getMinutes()
    if (now.getDay() === friday && hour < 21) {
      const clock = new Date(time)
      clock.setSeconds(0)
      if (minute < 30) {
        clock.setMinutes(30)
      } else {
        clock.setMinutes(0)
        clock.setHours(hour >= fiveClock ? hour + 1 : fiveClock)
      }
      timer = setTimeout(_ => {
        time2WriteReport()
        timing(clock)
      }, clock - now)
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
        } else {
          findCalendars(++pageNum)
        }
      }
    })
  })
}

// notify
const notify = msg => {
  chrome.notifications.create(null, {
    type: 'basic',
    iconUrl: 'logo.png',
    title: '提示',
    message: msg
  })
}

// contextMenus
const initContextMenus = _ => {
  const createMenus = key => {
    return chrome.contextMenus.create({
      title: `向${key}插入一行`, 
      contexts: ['selection'], 
      onclick: function({pageUrl, selectionText}){
        chrome.tabs.query({url: pageUrl}, function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, `${key}:${selectionText}`)
        })
      }
    })
  }
  chrome.contextMenus.removeAll(function(){
    createMenus("上")
    createMenus("下")
    createMenus("后")
  })
}

// event center
const initEvent = _ => {
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    const [whoami, params] = request.whoami.split(':')
    switch (whoami) {
      case 'newtab': 
        // return true is necessary for async function
        return !sendResponse(calendarImg)
      case 'notify':
        return notify(params)
      case 'contMenus':
        return initContextMenus()
      case 'checkV':
        return checkVersion()
    }
  })
}

// start form here
const run = (_ => {
  checkVersion()
  initEvent()
  reportNotify()
  _getConfig('allowGitlab', val => {
    if (!val) return findCalendars(1)
    calendarImg = val
  })
})()
