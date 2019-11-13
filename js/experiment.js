// battery
navigator.getBattery().then(function(battery) {
  console.log("Battery charging? " + (battery.charging ? "Yes" : "No"))
  console.log("Battery level: " + battery.level * 100 + "%")

  battery.addEventListener('chargingchange', function() {
    console.log("Battery charging? " + (battery.charging ? "Yes" : "No"))
  })

  battery.addEventListener('levelchange', function() {
    console.log("Battery level: " + battery.level * 100 + "%")
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
  window.addEventListener('offline', function(e) { 
    console.log('offline') 
  })
  window.addEventListener('online', function(e) {
    console.log('online') 
  })
}())
