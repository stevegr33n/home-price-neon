console.log("This prints to the console of the service worker (background.js)")

const userData = {
  userID: ""
}

chrome.runtime.onInstalled.addListener(async (userID) => {
  let uuid = crypto.randomUUID()
  const response = await fetch("http://localhost:4000/zoekravitz", {
    method: "POST",
    body: JSON.stringify({
      x: "65322b5b4f96b8784dc6fc08867cd000d415138e",
      xx: "b94e9f3d7e001981b2dd49f2a70822a8ac8f3e68",
      xxx: "c9cb14d85033efb285c56e0bbd7080aa400d23b2",
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      "User-ID": uuid
    }
  });

  let {data} = await response.json();
  userData.userID = data
});

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
chrome.tabs.onUpdated.addListener(async () => {
  const tab = await getCurrentTab()
  const rightmoveURL = 'https://www.rightmove.co.uk'

  if (tab.url && tab.url.includes(rightmoveURL + "/properties")) {
    const propertyID = tab.url.split("#")[0].slice(-9)

   chrome.tabs.sendMessage(tab.id, {
      type: "updatePrice",
      userID: userData.userID,
      propertyID: propertyID
    })
  }
});
