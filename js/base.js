// selector
const _qs = (selector, doc) => {
  doc = doc || document
  const $el = doc.querySelectorAll(selector)
  if ($el.length !== 1) return $el
  return $el[0]
}

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

