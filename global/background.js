console.log(chrome, '-----chrome-----')

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
  chrome.notifications.onButtonClicked.addListener((id, index) => {
    const time = index ? 60 : 30
    const timer = setTimeout(_ => {
      time2WriteReport()
      clearTimeout(timer)
    }, time * 60 * 1000)
  })
}

const friday = 5 
if (new Date().getDay() === friday) {
  const clock = new Date()
  clock.setHours(17)
  clock.setMinutes(0)
  clock.setSeconds(0)
  clock.setMilliseconds(0)
  const timer = setTimeout(_ => {
    time2WriteReport()
    clearTimeout(timer)
  }, clock.getTime() - now.getTime())
}

