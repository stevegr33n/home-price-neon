console.log("This prints to the console of the service worker (background.js)")

chrome.runtime.onInstalled.addListener((details) => {
  console.log('installed')
  //  generate the user ID here?
});

const rightmove = 'https://www.rightmove.co.uk'
async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
chrome.tabs.onUpdated.addListener(async () => {
  let tab = await getCurrentTab()

  if (tab.url && tab.url.includes(rightmove + "/properties")) {
    const propertyID = tab.url.split("#")[0].slice(-9)

   chrome.tabs.sendMessage(tab.id, {
      type: "updatePrice",
      propertyID: propertyID
    })
  }
});
