// all config
document.addEventListener('DOMContentLoaded', _ => {
  const $report = _qs('#weeklyReport')
  const $gitlab = _qs('#gitlab')
  const $newtab = _qs('#newtab')

  _qs('#submit').onclick = _ => {
    _setConfig({
      allowWeeklyReport: $report.checked,
      allowGitlab: $gitlab.checked
      // allowNewtab: $newtab.checked
    })
    _notify('修改成功，刷新后生效！')
  }

  _getConfig(null, storage => {
    $report.checked = storage.allowWeeklyReport === undefined ? true : storage.allowWeeklyReport
    $gitlab.checked = storage.allowGitlab === undefined ? true : storage.allowGitlab
    // $newtab.checked = storage.allowNewtab === undefined ? true : storage.allowNewtab
    _setConfig({
      allowWeeklyReport: $report.checked,
      allowGitlab: $gitlab.checked
      // allowNewtab: $newtab.checked
    })
    _qs('#newV').style.display = storage.newV ? 'block' : 'none'
  })
})

