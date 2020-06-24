function loadScript(name, tabId, cb) {
  if (process.env.NODE_ENV === 'production') {
    chrome.tabs.executeScript(tabId, { file: `/js/${name}.bundle.js`, runAt: 'document_end' }, cb)
  } else {
    // dev: async fetch bundle
    fetch(`https://localhost:3333/js/${name}.bundle.js`)
      .then((res) => res.text())
      .then((fetchRes) => {
        chrome.tabs.executeScript(tabId, { code: fetchRes, runAt: 'document_end' }, cb)
      })
  }
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'loading') return
  if (chrome.runtime.lastError) return

  loadScript('inject', tabId, () => console.log('load inject bundle success!'))
})
