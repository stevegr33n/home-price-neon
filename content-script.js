chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === "updatePrice") {
    const price = getHousePrice();
    try {
      const response = await getHousePriceHistory(message.propertyID, price)
      let {data} = await response.json();
      console.log(data)
      sendResponse(data)
    } catch (error) {
      console.error(error);
    }
    sendResponse([])
  }
});

function getHousePrice() {
  const documentRoot = document.getElementById("root").innerHTML
  console.log(documentRoot)
  const parser = new DOMParser();
    let res = parser.parseFromString(documentRoot, "text/html")
  console.log(res)
  // return document.getElementsByClassName("_1gfnqJ3Vtd1z40MlC0MzXu")[0].innerText;
  return 300000
}

async function getHousePriceHistory(propertyID, price){
  return fetch("http://localhost:4000/properties", {
    method: "POST",
    body: JSON.stringify({
      property_id: propertyID,
      price: price,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      "User-ID": "7a4d4a80-43c4-4a56-ae63-fdc90288cdf8"
    }
  });
}