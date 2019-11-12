// const _gaq = []
// _gaq.push(['_setAccount', 'UA-151671350-1'])
// _gaq.push(['_trackPageview'])

// ;(function() {
//   const ga = document.createElement('script') 
//   ga.type = 'text/javascript' 
//   ga.async = true
//   // ga.src = 'https://ssl.google-analytics.com/ga.js'
//   // ga.src = 'https://www.googletagmanager.com/gtag/js?id=UA-151671350-1'
//   // ga.src = 'https://www.googletagmanager.com/gtag/js?id=UA-151671350-1'
//   const s = document.getElementsByTagName('script')[0] 
//   s.parentNode.insertBefore(ga, s)
// })()


window.dataLayer = window.dataLayer || []
function gtag () {
  dataLayer.push(arguments)
}

gtag('js', new Date())
gtag('config', 'UA-151671350-1')
