document.addEventListener('DOMContentLoaded', _ => {
  const info = _qs('#info')
  // battery
  navigator.getBattery().then(function(battery) {
    console.log("Battery charging? " + (battery.charging ? "Yes" : "No"))
    console.log("Battery level: " + battery.level * 100 + "%")
    info.txt(info.txt().replace('{{charging}}', battery.charging ? '充电中' : '已断开'))
    info.txt(info.txt().replace('{{percent}}', battery.level * 100 + "%"))

    battery.addEventListener('chargingchange', function() {
      console.log("Battery charging? " + (battery.charging ? "Yes" : "No"))
      info.txt(info.txt().replace('{{charging}}', battery.charging ? '充电中' : '已断开'))
    })

    battery.addEventListener('levelchange', function() {
      console.log("Battery level: " + battery.level * 100 + "%")
      info.txt(info.txt().replace('{{percent}}', battery.level * 100 + "%"))
    })

    battery.addEventListener('chargingtimechange', function() {
      console.log("Battery charging time: " + battery.chargingTime + " seconds")
    })

    battery.addEventListener('dischargingtimechange', function() {
      console.log("Battery discharging time: " + battery.dischargingTime + " seconds")
    })

  })

  // online offline
  ;(function(){
    info.txt(info.txt().replace('{{network}}', navigator.onLine ? '已连接' : '已断开'))
    window.addEventListener('offline', function(e) { 
      console.log('offline') 
      info.txt(info.txt().replace('{{network}}', '已断开'))
    })
    window.addEventListener('online', function(e) {
      console.log('online') 
      info.txt(info.txt().replace('{{network}}', '已连接'))
    })
  }())

  chrome.runtime.getPlatformInfo(function(platform){
    info.txt(info.txt().replace('{{os}}', platform.os))
  })
  
// new CookieCache()
// new Timer()
})
