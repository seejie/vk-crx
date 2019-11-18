document.addEventListener('DOMContentLoaded', _ => {
  _qs('#submit').onclick = _ => {
    const val = str => /\d+/.exec(str)[0]
    let [week, freq, clock] = _qs(':checked').toArray()

    _setConfig({
      reportConfig: {
        week: val(week.id),
        freq: val(freq.id),
        clock: val(clock.id)
      }
    }, _ => _notify('修改成功！'))
  }
})
