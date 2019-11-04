// all config
document.addEventListener('DOMContentLoaded', _ => {
  const $report = _qs('#weeklyReport')
  const $gitlab = _qs('#gitlab')

  _qs('#submit').onclick = _ => {
    chrome.storage.local.set({allowWeeklyReport: $report.checked})
    chrome.storage.local.set({allowGitlab: $gitlab.checked})
    alert('修改成功！刷新后生效！')
  }

  chrome.storage.local.get(null, storage => {
    $report.checked = storage.allowWeeklyReport === undefined ? true : storage.allowWeeklyReport
    $gitlab.checked = storage.allowGitlab === undefined ? true : storage.allowGitlab
  })
})