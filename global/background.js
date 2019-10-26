const chr = chrome
console.log(chr, '----------')
const currVersion = chrome.app.getDetails().version

// check update
const checkUpdate = _ => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", 'https://github.com/seejie/vk-crx/blob/master/manifest.json', true);
  xhr.send();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) { 
      const res = xhr.response
      const version = /<\/span>(\d+\.\d+)<span class="pl-pds">/.exec(res)[1]
      if (version > currVersion) {
        window.open('https://github.com/seejie/vk-crx/archive/master.zip')
      }
    }
  }
}

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
  
  const friday = 5
  if (new Date().getDay() === friday) {
    const clock = new Date()
    clock.setHours(15)
    clock.setMinutes(0)
    clock.setSeconds(0)
    clock.setMilliseconds(0)
    
    const delay = clock.getTime() - new Date().getTime()
    if (delay < 0) return
    timer = setTimeout(_ => {
      time2WriteReport()
      clearTimeout(timer)
    }, delay)
  }
}


const run = _ => {
  checkUpdate()
  reportNotify()
}

// start form here
run()
