chrome.action.onClicked.addListener(async () => {
    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});

    for (let tag of ['www', 'web']) {
        if (tab.url.includes(tag)) {
            chrome.tabs.update(tab.id, {url: tab.url.replace(tag, 'm')});
        }
    }
    
});


chrome.tabs.onUpdated.addListener((tab_id, info, tab) => {

    if (info.status === 'complete')
        if(tab.url.includes('m.facebook.com') || tab.url.includes('mobile.facebook.com')) {

        chrome.scripting.executeScript({
            target: { tabId: tab_id },
            files: ['content-script.js']
        });

    }
});