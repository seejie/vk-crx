// todo
chrome.devtools.panels.create('vipkid', '/images/logo.png', '/pages/devPanel.html', function(panel){
	console.log(111, '----123------')
})

chrome.devtools.panels.elements.createSidebarPane("我的侧边栏", function(sidebar) {
  sidebar.setObject({ some_data: "要显示的某些数据" })
  console.log(22, '----------')
})

console.log(chrome, '----------')
