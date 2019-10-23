
// selector
// 'this' will be lost when using arraw function
const _qs = function (selector) {
  const $el = this.document.querySelectorAll(selector)
  if ($el.length !== 1) return $el
  return $el[0]
}

// createElement abbr.
const _cE = el => document.createElement(el)

// ajax
const _ajax = options => {
  const http = new XMLHttpRequest()
    http.open(options.type || 'GET', options.url, true)
    http.setRequestHeader('Accept', 'application/json, text/plain, */*; charset=utf-8')
    http.send(options.type ? options.data : null)
    http.onreadystatechange = _ => {
      if (http.readyState !== 4 || !/200/.test(http.status)) return
      options.success && options.success(JSON.parse(http.response))
    }
}

// toArray
const Node2Arr = (nodes) => {
  return [].slice.call(nodes)
}

// toArray
NodeList.prototype.toArray = function () {  
  return Node2Arr(this)
}

// find siblings with index
Node.prototype.siblings = function (idx) {
  return this.parentNode.children[idx]
}

// black hole
// build a black hole using by 'src' and through back
const _blackHole = (src, through) => {
  const iframe = _cE('iframe')
  iframe.src = src
  iframe.className = 'blackhole'
  iframe.style.display = 'none'
  document.body.appendChild(iframe)
  iframe.onload = _ => through(iframe.contentWindow, _ => document.body.removeChild(iframe))
}
