// selector
// 'this' will be lost when using arraw function
const _qs = (selector, ctx) => {
  ctx = ctx || document
  const $el = ctx.querySelectorAll(selector)
  if ($el.length > 1) return $el
  return $el[0]
}

// html(string) format to doc node
const _2doc = html => new DOMParser().parseFromString(html,'text/html')

// dom(string) format to dom node
const _2dom = dom => _2doc(dom).body.children[0]

// style(string) format to style node
const _2Style = style => _2doc(style).head

// create and insert css
const _injectCss = style => _qs('head').appendChild(_2Style(`<style>${style}</style>`))

// createElement abbr.
const _cE = el => document.createElement(el)

// ajax
const _ajax = options => {
  const http = new XMLHttpRequest()
  http.open(options.type || 'GET', options.url, true)
  http.setRequestHeader('Accept', 'application/json, text/plain, */*; charset=utf-8')

  const headers = options.headers
  if (headers instanceof Array) {
    options.headers.forEach(el => {
      http.setRequestHeader(Object.keys(el)[0], Object.values(el)[0])
    })
  } else if (headers instanceof Object) {
    http.setRequestHeader(Object.keys(headers)[0], Object.values(headers)[0])
  } 

  http.send(options.type ? options.data : null)
  http.onreadystatechange = _ => {
    if (http.readyState !== 4 || !/200/.test(http.status)) return
    if (options.success) {
      const res = options.dataType ? http.response : JSON.parse(http.response)
      options.success(res)
    }
  }
}

// fetch
const _http = options => {
  fetch({

  }).then()
}

// toArray use for node in iframe
const Node2Arr = nodes => {
  return [].slice.call(nodes)
}

// toArray
NodeList.prototype.toArray = function () {  
  return Node2Arr(this)
}

// toArray
HTMLCollection.prototype.toArray = function () {
  return Node2Arr(this)
}

// toArray
Node.prototype.toArray = function () {
  return [this]
}

// find parentNode using by
// the number of closest generation or the name in family tree
Node.prototype.parent = function (key) {
  let father = this.parentNode
  if (typeof key !== 'string') {
    if (!key) return father
    while (key !== 0 && father) {
      father = father.parentNode
      key--
    }
    return father
  } else {
    const attr = key[0] === '.'
      ? 'className'
      : key[0] === '#'
        ? 'id' : 'tagName'
    while (father && father !== document) {
      const reg = new RegExp(key.replace(/\.|\#/g, ''), 'i')
      if (reg.test(father[attr])) return father
      father = father.parentNode
    }
    return null
  }
}

// find childNode using by the rank or the name in family
// always return one child even though they are many
Node.prototype.child = function (key) {
  if (typeof key !== 'string') {
    return this.children[key || 0]
  } else {
    const attr = key[0] === '.'
      ? 'className'
      : key[0] === '#'
        ? 'id' : 'tagName'
    const el = this.children.toArray().find(el=>{
      const reg = new RegExp('^' + key.replace(/\.|\#/g, '') + '$', 'i')
      return reg.test(el[attr])
    })
    if (el) return el
    let target
    this.children.toArray().forEach(el=>{
      if (target) return
      target = el.child(key)
    })
    if (target) return target
  }
}

// find siblings using by the rank in family
Node.prototype.siblings = function (idx) {
  return this.parent().child(idx)
}

// abstract getters/setters
Node.prototype.abst = function (attr, args, name) {
  if (name) return args ? (this[name][attr] = args) && this : this[name][attr]
  return args ? (this[attr] = args) && this : this[attr]
}

// get/set attrs
Node.prototype.attr = function (attr, args) {
  return this.abst(attr, args)
}

// get/set dataset
Node.prototype.data = function (attr, args) {
  return this.abst(attr, args, 'dataset')
}

// get/set style
Node.prototype.css = function (attr, args) {
  return this.abst(attr, args, 'style')
}

// get/set innerHTML
Node.prototype.html = function (args) {
  return this.attr('innerHTML', args)
}

// get/set innerText
Node.prototype.txt = function (args) {
  return this.attr('innerText', args)
}

// get/set class name
Node.prototype.class = function (args) {
  return this.attr('className', args)
}

// add new class name 
Node.prototype.addClass = function (name) {
  return (this.classList.add(name)) || this
}

// hide
Node.prototype.hide = function () {
  return (this.style.display = 'none') && this
}

// show
Node.prototype.show = function (type) {
  if (!type) {
    this.style.display = /div|p|ul/i.test(this.tagName) ? 'block' : 'inline'
  } else {
    this.style.display = type
  }
  return this
}

// check display or not
Node.prototype.isHide = function () {
  return this.style.display === 'none'
}

// wormhole
// bild a wormhole let crawler find specify content
const _wormhole = src => {
  return new Promise((resolve, reject) => {
    _ajax({
      url: src,
      dataType: 'html',
      success: res => resolve(_2doc(res))
    })
  })
}

// black hole
// build a black hole using by the 'src' and through back
const _blackHole = (src, through) => {
  const iframe = _cE('iframe').attr('src', src).class('blackhole').hide()
  document.body.appendChild(iframe)
  iframe.onload = _ => through(iframe.contentWindow.document, _ => document.body.removeChild(iframe))
}

// set data to storage
const _setConfig = obj => chrome.storage.sync.set(obj)

// get data from storage
const _getConfig = (key, cb) => {
  _callBackground({whoami: 'checkV'})
  chrome.storage.sync.get(null, storage => cb(key ? storage[key]: storage))
}

// send message to background
const _callBackground = params => chrome.runtime.sendMessage(params)

// notify
const _notify = msg => _callBackground({whoami: `notify:${msg}`})

// statistics
const statistics = _ => {
  const ga = document.createElement('script') 
  ga.type = 'text/javascript' 
  ga.async = true
  // <script type="text/javascript" src="https://s9.cnzz.com/z_stat.php?id=1278198027&web_id=1278198027"></script>
  ga.src = 'https://www.googletagmanager.com/gtag/js?id=UA-151671350-1'
  const s = document.getElementsByTagName('script')[0] 
  s.parentNode.insertBefore(ga, s)
}

// 
const reportData = _ => {
  window.dataLayer = window.dataLayer || []
  function gtag () {
    dataLayer.push(arguments)
  }

  gtag('js', new Date())
  gtag('config', 'UA-151671350-1')
}