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

    console.log(tab.url)
    console.log(tab.id)
    console.log(propertyID)
    // chrome.tabs.sendMessage(tab.id, {
    //   type: "NEW",
    //   propertyID: propertyID
    // })

    // chrome.tabs.sendMessage(tab.id, { method: "updatePrice", propertyID: propertyID}, (response) => {
    //   console.log(response);
    // });
    //
    // chrome.runtime.sendMessage('updatePrice', (response) => {
    //   // 3. Got an asynchronous response with the data from the service worker
    //   console.log('received user data', response);
    //   return true
    // });

   chrome.tabs.sendMessage(tab.id, {
      type: "updatePrice",
      propertyID: propertyID
    })
  }
});
