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
  _getConfig('calendarImg', src => {
    _qs('body').style.backgroundImage = `url(${src})`
    getSoup()
  })
}

setBackgroundImg()

chrome.runtime.onMessage.addListener(function(request) {
  const [whoami, ...src] = request.whoami.split(':')
  if (whoami !== 'newtab') return
  _qs('body').style.backgroundImage = `url(${src.join(':')})`
  getSoup()
})

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