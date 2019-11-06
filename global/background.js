let calendarImg
// reprot notifier
const reportNotify = _ => {
  let timer
  const time2WriteReport = _ => {
    chrome.notifications.create(null, {
      type: 'basic',
      iconUrl: 'images/logo.png',
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
        clock.setHours(hour >= 17 ? hour + 1 : 17)
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

const initEvent = _ => {
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.whoami === 'newtab') {
      sendResponse(calendarImg)
      // return true is necessary for async function
      return true
    } 
  })
}

const run = _ => {
  initEvent()
  reportNotify()
  _getConfig('allowGitlab', val => {
    if (!val) return findCalendars(1)
    calendarImg = val
  })
}

// start form here
run()
