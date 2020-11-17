const crytcoinsSelect = document.querySelector("#criptomonedas");
const coinSelect = document.querySelector("#moneda");
const crytcoinsForm = document.querySelector("#formulario");
const result = document.querySelector("#resultado");

const searchObj = {
  coin: "",
  crytCoin: "",
};

const getCrytCoins = (crytcoins) =>
  new Promise((resolve) => {
    resolve(crytcoins);
  });

document.addEventListener("DOMContentLoaded", () => {
  requestCrytCoins();
  crytcoinsForm.addEventListener("submit", submitForm);
  crytcoinsSelect.addEventListener("change", readValue);
  coinSelect.addEventListener("change", readValue);
});

async function requestCrytCoins() {
  const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=CRC`;
  fetch(url)
    .then((res) => res.json())
    .then((res) => getCrytCoins(res.Data))
    .then((crytcoins) => selectCrytcoins(crytcoins));

  try {
    const res = await fetch(url);
    const result = await res.json();
    const crytcoins = await getCrytCoins(result.Data);
    selectCrytcoins(crytcoins);
  } catch (error) {
    console.log(error);
  }
}

function selectCrytcoins(crytcoins) {
  crytcoins.forEach((coin) => {
    const { FullName, Name } = coin.CoinInfo;

    const option = document.createElement("option");

    option.value = Name;
    option.textContent = FullName;
    crytcoinsSelect.appendChild(option);
  });
}

function readValue(e) {
  searchObj[e.target.name] = e.target.value;
}

function submitForm(e) {
  e.preventDefault();

  const { coin, crytCoin } = searchObj;
  if (coin === "" || crytCoin == "") {
    showAlert("Ambos campos son obligatorios");
    return;
  }

  requestAPI();
}

async function requestAPI() {
  const { coin, crytCoin } = searchObj;
  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${crytCoin}&tsyms=${coin}`;
  showSpinner();
  try {
    const response = await fetch(url);
    const result = await response.json();
    showResult(result.DISPLAY[crytCoin][coin]);
  } catch (error) {
    console.log(error);
  }
}

function showResult(results) {
  clearHTML();
  const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = results;

  const price = document.createElement("p");
  price.classList.add("precio");
  price.innerHTML = `El precio es: <span>${PRICE} </span>`;

  const highPrice = document.createElement("p");
  highPrice.innerHTML = `El precio más alto del día es: <span>${HIGHDAY} </span>`;

  const lowPrice = document.createElement("p");
  lowPrice.innerHTML = `El precio más bajo del día es: <span>${LOWDAY} </span>`;

  const lastDay = document.createElement("p");
  lastDay.innerHTML = `Variación últimas 24 horas es: <span>${CHANGEPCT24HOUR}% </span>`;

  const lastUpdate = document.createElement("p");
  lastUpdate.innerHTML = `Última actualización: <span>${
    LASTUPDATE === "Just now" ? "Justo ahora" : LASTUPDATE
  } </span>`;

  result.appendChild(price);
  result.appendChild(highPrice);
  result.appendChild(lowPrice);
  result.appendChild(lastDay);
  result.appendChild(lastUpdate);
}

function showAlert(msg) {
  const existError = document.querySelector(".error");
  if (!existError) {
    const divMsg = document.createElement("div");
    divMsg.classList.add("error");

    divMsg.textContent = msg;
    crytcoinsForm.appendChild(divMsg);

    setTimeout(() => {
      divMsg.remove();
    }, 3000);
  }
}

function clearHTML() {
  while (result.firstChild) {
    result.removeChild(result.firstChild);
  }
}

function showSpinner() {
  clearHTML();
  const spinner = document.createElement("div");
  spinner.classList.add("spinner");
  spinner.innerHTML = `
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
  `;

  result.appendChild(spinner);
}
