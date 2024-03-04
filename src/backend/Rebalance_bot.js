const Protocol = require('./Protocol');


const exchange_name = 'bybit';
const symbol = 'BTC/USDT';
const apikey = "CZwFnRVbvpeRWHR4gF";
const secretkey = "E04YRfu3WHmz3aKjXwRzcLC4jVJ8dM4arf6P";

const protocol = new Protocol(exchange_name, symbol, apikey, secretkey);

async function fetchData() {
  try {
      const dataid = await findOneByBotID(1);
      console.log(dataid);
  } catch (error) {
      console.error(error);
  }
}

// Call the function
fetchData();