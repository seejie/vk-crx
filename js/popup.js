// all config
document.addEventListener('DOMContentLoaded', _ => {
  const $report = _qs('#weeklyReport')
  const $gitlab = _qs('#gitlab')
  const $newtab = _qs('#newtab')

  _qs('#submit').onclick = _ => _setConfig({
    allowWeeklyReport: $report.checked,
    allowGitlab: $gitlab.checked,
    allowNewtab: $newtab.checked
  }, _ => _notify('修改成功！'))

  _getConfig(null, storage => {
    $report.checked = storage.allowWeeklyReport === undefined ? true : storage.allowWeeklyReport
    $gitlab.checked = storage.allowGitlab === undefined ? true : storage.allowGitlab
    $newtab.checked = storage.allowNewtab 

    _setConfig({
      allowWeeklyReport: $report.checked,
      allowGitlab: $gitlab.checked,
      allowNewtab: $newtab.checked
    })
    renew(storage.newV)
  })

  const crxid = chrome.runtime.id
  // stop using crx
  _qs('#stopUsing').onclick = _ => chrome.management.setEnabled(crxid, false)

  // verison
  _qs('#version').txt(`（${chrome.app.getDetails().version}）`)

  // update crx
  _qs('#update').onclick = _ => chrome.tabs.create({url: `1chrome://extensions?id=${crxid}`})

  // more config
  _qs('#more').onclick = _ => chrome.tabs.create({url: `chrome-extension://${crxid}/pages/options.html`})
})

_runtimeMsg(function(request) {
  const [whoami, bool] = request.whoami.split(':')
  if (whoami !== 'popup') return
  renew(request)
})

const renew = bool => {
  _qs('#newV').style.display = bool ? 'block' : 'none'
  _qs('#update').style.display = bool ? 'inline' : 'none'
}
