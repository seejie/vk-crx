// todo
chrome.devtools.panels.create('vipkid', '/images/logo.png', '/pages/devPanel.html', function(panel){
	console.log(111, '----123------')
})

chrome.devtools.panels.elements.createSidebarPane("我的侧边栏", function(sidebar) {
  // 这里是侧边栏的初始化代码
  sidebar.setObject({ some_data: "要显示的某些数据" })
  console.log(22, '----------')
})