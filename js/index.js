// waiting for iframe
window.onload = _ => {
  weeklyReport.init()
  runNowBtn.init()
}

document.addEventListener('DOMContentLoaded', _ => {
  gitlab.init()
})
