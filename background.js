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
  await chrome.storage.local.set({userID: data})
});

chrome.tabs.onUpdated.addListener(fetchPropertyPrice);
chrome.tabs.onHighlighted.addListener(fetchPropertyPrice);
async function fetchPropertyPrice() {
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true, status: "complete"});
  const rightmoveURL = 'https://www.rightmove.co.uk'

  console.log(tab)

  if (tab?.url?.includes(rightmoveURL + "/properties")) {
    const propertyID = tab.url.split("#")[0].slice(-9)

    const {userID} = await chrome.storage.local.get(["userID"])

    const response = await chrome.tabs.sendMessage(tab.id, {greeting: "yeah", propertyID, userID});
    console.log(response);
  }
}