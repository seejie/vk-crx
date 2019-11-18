document.addEventListener('DOMContentLoaded', _ => {
  // battery
  navigator.getBattery().then(function(battery) {
    console.log("Battery charging? " + (battery.charging ? "Yes" : "No"))
    console.log("Battery level: " + battery.level * 100 + "%")
    _qs('#charging').txt(battery.charging ? '充电中' : '已断开')
    _qs('#percent').txt(battery.level * 100 + "%")

    battery.addEventListener('chargingchange', function() {
      console.log("Battery charging? " + (battery.charging ? "Yes" : "No"))
      _qs('#charging').txt(battery.charging ? '充电中' : '已断开')
    })

    battery.addEventListener('levelchange', function() {
      console.log("Battery level: " + battery.level * 100 + "%")
      _qs('#percent').txt(battery.level * 100 + "%")
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
    _qs('#network').txt(navigator.onLine ? '已连接' : '已断开')
    window.addEventListener('offline', function(e) { 
      console.log('offline') 
      _qs('#network').txt('已断开')
    })
    window.addEventListener('online', function(e) {
      console.log('online') 
      _qs('#network').txt('已连接')
    })
  }())

  chrome.runtime.getPlatformInfo(function(platform){
    _qs('#os').txt(platform.os)
  })
  
// new CookieCache()
// new Timer()
})
