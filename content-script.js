chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === "updatePrice") {
    const price = getHousePrice();
    try {
      const response = await getHousePriceHistory(message.propertyID, price, message.userID)
      let {data} = await response.json();
      displayPriceHistory(data)
      sendResponse(data)
    } catch (error) {
      console.error(error);
    }
    sendResponse([])
  }
});

function generateTableHead(table) {
  let thead = table.createTHead();
  let row = thead.insertRow();

  let priceColumn = document.createElement("th");
  let priceColumnText = document.createTextNode("Price");
  priceColumn.appendChild(priceColumnText);

  let dateColumn = document.createElement("th");
  let dateColumnText = document.createTextNode("Date");
  dateColumn.appendChild(dateColumnText);

  row.appendChild(dateColumn);
  row.appendChild(priceColumn);
}

function generateTable(table, data) {
  for (let element of data) {
    const row = table.insertRow();

    const dateCell = row.insertCell();
    const date = new Date(element.date);
    date.toLocaleDateString('en-GB')

    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1; // month is zero-based
    let dd = date.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formatted = dd + '/' + mm + '/' + yyyy;

    const dateText = document.createTextNode(formatted);
    dateCell.appendChild(dateText);

    const priceCell = row.insertCell();

    const quid = new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumSignificantDigits: 4,
    });

    const priceText = document.createTextNode(quid.format(element.price));
    priceCell.appendChild(priceText);
  }
}

function displayPriceHistory(data) {
  const parent = document.querySelector('main > div > *:last-child > div > article > div > div')
  const table = document.createElement("table");
  table.classList.add("styled-table");

  generateTableHead(table);
  generateTable(table, data);

  parent.insertBefore(table, parent.lastChild)
}

function getHousePrice() {
  const value = document.getElementById("propertyValue").value
  return Number(value.replace(/,/g, ''));
}

async function getHousePriceHistory(propertyID, price, userID){
  return fetch("http://localhost:4000/properties", {
    method: "POST",
    body: JSON.stringify({
      property_id: propertyID,
      price: price,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      "User-ID": userID
    }
  });
}