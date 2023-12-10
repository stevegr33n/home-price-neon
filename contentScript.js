// This script gets injected into any opened page
// whose URL matches the pattern defined in the manifest
// (see "content_script" key).
// Several foreground scripts can be declared
// and injected into the same or different pages.

(() => {
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.method === "updatePrice") {
      const price = getHousePrice();
      const priceHistory = getHousePriceHistory(message.propertyID, price)
      sendResponse(true)
    }
  })
})();

function getHousePrice() {
  // const documentRoot = document.getElementById("root").innerText
  // const parser = new DOMParser();
  // let res = parser.parseFromString(documentRoot, "text/html")
  // console.log(res)
  return document.getElementsByClassName("_1gfnqJ3Vtd1z40MlC0MzXu")[0].innerText;

}

function getHousePriceHistory(propertyID, price) {
//   call your DB
//   get property by propertyID
}