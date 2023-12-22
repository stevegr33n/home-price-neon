chrome.runtime.onInstalled.addListener(async (userID) => {
  let uuid = crypto.randomUUID()
  const response = await fetch("https://rub-a-dub-dub.club/create-user", {
    method: "GET",
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

    const response = await chrome.tabs.sendMessage(tab.id, {greeting: "update-price", propertyID, userID});
    console.log(response);
  }
}