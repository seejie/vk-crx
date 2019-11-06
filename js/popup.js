// notify
const notify = _ => {
  chrome.notifications.create(null, {
    type: 'basic',
    iconUrl: '../images/logo.png',
    title: 'ヾ(◍°∇°◍)ﾉﾞ',
    message: '修改成功，刷新后生效！'
  })
}

// all config
document.addEventListener('DOMContentLoaded', _ => {
  const $report = _qs('#weeklyReport')
  const $gitlab = _qs('#gitlab')
  const $newtab = _qs('#newtab')

  _qs('#submit').onclick = _ => {
    _setConfig({allowWeeklyReport: $report.checked})
    _setConfig({allowGitlab: $gitlab.checked})
    // _setConfig({allowNewtab: $newtab.checked})
    notify()
  }

  chrome.storage.local.get(null, storage => {
    $report.checked = storage.allowWeeklyReport === undefined ? true : storage.allowWeeklyReport
    $gitlab.checked = storage.allowGitlab === undefined ? true : storage.allowGitlab
    // $newtab.checked = storage.allowNewtab === undefined ? true : storage.allowNewtab
  })
})

