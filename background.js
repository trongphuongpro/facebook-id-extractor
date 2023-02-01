chrome.action.onClicked.addListener(async (tab) => {
  // let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  await chrome.tabs.reload();
  await sleep(3000);

  if (
    ["/posts/", "/permalink.php", "story_fbid"].some((kw) =>
      tab.url.includes(kw)
    )
  ) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["get_post_id.js"],
    });
  } else if (
    ["/videos", "/watch", "/reel", "/stories"].every(
      (kw) => !tab.url.includes(kw)
    )
  ) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["get_user_id.js"],
    });
  }
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// chrome.tabs.onUpdated.addListener((tab_id, info, tab) => {

//     if (info.status === 'complete') {

//     }
// });
