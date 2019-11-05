// all config
document.addEventListener('DOMContentLoaded', _ => {
  const $report = _qs('#weeklyReport')
  const $gitlab = _qs('#gitlab')
  const $newtab = _qs('#newtab')

  _qs('#submit').onclick = _ => {
    _setConfig({allowWeeklyReport: $report.checked})
    _setConfig({allowGitlab: $gitlab.checked})
    _setConfig({allowNewtab: $newtab.checked})
    alert('修改成功！刷新后生效！')
  }

  chrome.storage.local.get(null, storage => {
    console.log(storage, '----------')
    $report.checked = storage.allowWeeklyReport === undefined ? true : storage.allowWeeklyReport
    $gitlab.checked = storage.allowGitlab === undefined ? true : storage.allowGitlab
    $newtab.checked = storage.allowNewtab === undefined ? true : storage.allowNewtab
  })
})