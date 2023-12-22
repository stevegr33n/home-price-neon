var tabUpdating = false;
chrome.runtime.onMessage.addListener(
  async function(request, sender, sendResponse) {
    if (request.greeting === "update-price" && tableDoesNotExist() && !tabUpdating) {
      tabUpdating = true
      const price = getPropertyPrice();
      try {
        const response = await getPropertyPriceHistory(request.propertyID, price, request.userID)
        let {data} = await response.json();
        displayPropertyPriceHistory(data);
        tabUpdating = false
        return true;
      } catch (error) {
        tabUpdating = false
        return true;
      }
    }
    tabUpdating = false
    return true;
});

function tableDoesNotExist() {
  return document.getElementById("res-table") == null
}

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

function displayPropertyPriceHistory(data) {
  const parent = document.querySelector('main > div > *:last-child > div > article > div > div')
  const table = document.createElement("table");
  table.setAttribute("id", "res-table");
  table.classList.add("styled-table");

  generateTableHead(table);
  generateTable(table, data);

  if (tableDoesNotExist()) {
    parent.insertBefore(table, parent.lastChild)
  }
}

function getPropertyPrice() {
  const value = document.getElementById("propertyValue").value
  return Number(value.replace(/,/g, ''));
}

async function getPropertyPriceHistory(propertyID, price, userID){
  return fetch("https://rub-a-dub-dub.club/get-property-prices", {
    method: "POST",
    body: JSON.stringify({
      property_id: propertyID,
      price: price,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      "User-ID": userID,
    }
  });
}