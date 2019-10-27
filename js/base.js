// for reuse
const domParser = new DOMParser()

// selector
// 'this' will be lost when using arraw function
const _qs = (selector, ctx) => {
  ctx = ctx || document
  const $el = ctx.querySelectorAll(selector)
  if ($el.length > 1) return $el
  return $el[0]
}

// html(string) format to doc node
const _2doc = html => {
  return domParser.parseFromString(html,'text/html')
}

// dom(string) format to dom node
const _2dom = dom => {
  return _2doc(dom).body.children[0]
}

// style(string) format to style node
const _2Style = style => {
  return _2doc(style).head
}

// create and insert css
const _injectCss = style => {
  _qs('head').appendChild(_2Style(style))
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

// not undefined && not null
// can be '' or 0
const nil = val => {
  return val !== undefined && val !== null
}

// toArray
NodeList.prototype.toArray = function () {  
  return Node2Arr(this)
}

// toArray
HTMLCollection.prototype.toArray = function () {
  return Node2Arr(this)
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
    return this.children.toArray().find(el=>{
      const reg = new RegExp(key.replace(/\.|\#/g, ''), 'i')
      return reg.test(el[attr])
    })
  }
}

// find siblings using by the rank in family
Node.prototype.siblings = function (idx) {
  return this.parent().child(idx)
}

// get/set attrs
Node.prototype.attrs = function (attr, args) {
  return args ? (this[attr] = args) && this : this[attr]
}

// get/set innerHTML
Node.prototype.html = function (args) {
  return this.attrs('innerHTML', args)
}

// get/set innerText
Node.prototype.txt = function (args) {
  return this.attrs('innerText', args)
}

// get/set class name
Node.prototype.class = function (args) {
  return this.attrs('className', args)
}

// add new class name
Node.prototype.addClass = function (name) {
  return (this.class(`${this.class()} ${name}`)) && this
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

Node.prototype.isHide = function () {
  return this.style.display === 'none'
}

// dataset
Node.prototype.data = function (attr, args) {
  return args ? (this.dataset[attr] = args) && this : this.dataset[attr]
}

// wormhole
// bild a wormhole let crawler find specify content
const _wormhole = (src, back) => {
  _ajax({
    url: src,
    dataType: 'html',
    success: res => back(_2doc(res))
  })
}

// black hole
// build a black hole using by the 'src' and through back
const _blackHole = (src, through) => {
  const iframe = _cE('iframe').attrs('src', src).class('blackhole').hide()
  document.body.appendChild(iframe)
  iframe.onload = _ => through(iframe.contentWindow.document, _ => document.body.removeChild(iframe))
}
