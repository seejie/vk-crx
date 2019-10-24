const init = _ => {
  weeklyReport.init()
  runNowBtn.init()
  gitlab.init()
}

window.onload = _ => init()
