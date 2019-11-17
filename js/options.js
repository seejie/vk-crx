document.addEventListener('DOMContentLoaded', _ => {
  // todo
  _qs('#config').onclick = e => {
    if (e.target.type !== 'radio') return
    console.log(e.target, '------1----')
  }
})
