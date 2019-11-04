// all config
document.addEventListener('DOMContentLoaded', _ => {
  const $report = _qs('#weeklyReport')
  const $gitlab = _qs('#gitlab')

  _qs('#submit').onclick = _ => {
    chrome.storage.local.set({allowsWeeklyReport: $report.checked})
    chrome.storage.local.set({allowsGitlab: $gitlab.checked})
    alert('修改成功！刷新后生效！')
  }

  chrome.storage.local.get(null, storage => {
    $report.checked = storage.allowsWeeklyReport === undefined ? true : storage.allowsWeeklyReport
    $gitlab.checked = storage.allowsGitlab === undefined ? true : storage.allowsGitlab
  })
})