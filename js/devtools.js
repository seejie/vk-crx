// todo
const panels = chrome.devtools.panels
const elPanel = panels.elements
panels.create('vipkid', 'logo.png', '/pages/devPanel.html', function(panel){
	// console.log(111, '----123------')
})

elPanel.createSidebarPane("attrs", function(sidebar) {
  elPanel.onSelectionChanged.addListener(function() {
    sidebar.setExpression('(' + fillterCurrDom.toString() + ')()', 'current node valid attributes')
    // sidebar.setExpression('$0')
  })
})

function fillterCurrDom () {
  const obj2 = {
    win: window,
    loc: location,
    doc: document,
    nav: navigator,
    cur: $0
  }
  const obj = {}
  for (let attr in $0) {
    if ($0[attr] !== null && typeof $0[attr] !== 'function') {
      obj[attr] = $0[attr]
    }
  }
  return obj
}
