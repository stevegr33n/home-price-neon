// This script gets injected into any opened page
// whose URL matches the pattern defined in the manifest
// (see "content_script" key).
// Several foreground scripts can be declared
// and injected into the same or different pages.

// console.log("This prints to the console of the page (injected only if the page url matched)")

(() => {
  chrome.runtime.onMessage.addListener((obj, sender, res) => {
    const {type, value, propertyID } = obj;
      const priceHistory = getHousePriceHistory(propertyID)
      const price = getHousePrice();

  })
})();

function getHousePrice() {
  return document.getElementsByClassName("_1gfnqJ3Vtd1z40MlC0MzXu")[0].innerText;
}

function getHousePriceHistory(propertyID) {
//   call your DB
//   get property by propertyID
}