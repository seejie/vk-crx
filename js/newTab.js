// soup
const getSoup = _ => {
  _ajax({
    url: 'http://open.iciba.com/dsapi/',
    success: function (res) {
      _qs('#soup_cn').txt(res.note)
      _qs('#soup_en').txt(res.content)
    }
  })
}

const setBackgroundImg = _ => {
  chrome.runtime.sendMessage({whoami: 'newtab'}, function(res) {
    if(!res) return 
    _qs('body').style.backgroundImage = `url(${res})`
    getSoup()
  })
}

_getConfig('allowNewtab', val => val && setBackgroundImg())

// duanzi
// const today = new Date()
// _ajax({
//   url: `http://www.dutangapp.cn/u/toxic?date=${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`,
//   success: function (res) {
//     console.log(res, '----------')
//     // _qs('#soup_cn').txt(res.note)
//     // _qs('#soup_en').txt(res.content)
//   }
// })