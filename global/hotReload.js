chrome.management.getSelf (self => {
  self.installType === 'development' && chrome.runtime.getPackageDirectoryEntry(watchFilesChanged)
})

const watchFilesChanged = (dir, lastTimestamp) => {
  timestampForFilesInDirectory(dir).then(timestamp => {
    if (!lastTimestamp || (lastTimestamp === timestamp)) {
      setTimeout(_ => watchFilesChanged(dir, timestamp), 1000) 
    } else {
      reload()
    }
  })
}

const filesInDirectory = dir => new Promise(resolve =>
  dir.createReader().readEntries(entries =>
    Promise.all(entries.filter(e => e.name[0] !== '.').map(e =>
      e.isDirectory ? filesInDirectory(e) : new Promise(resolve => e.file(resolve))
    )).then(files => [].concat(...files)).then(resolve)
  )
)

const timestampForFilesInDirectory = dir =>
  filesInDirectory(dir).then(files => files.map(f => f.name + f.lastModifiedDate).join())

const reload = _ => chrome.tabs.query ({active: true, currentWindow: true}, tabs => {
  tabs[0] && chrome.tabs.reload(tabs[0].id) 
  chrome.runtime.reload()
})


// todo update
chrome.runtime.onUpdateAvailable.addListener(function(e){
  chrome.runtime.reload()
})

// todo
// chrome.management.launchApp(string id, function callback)
