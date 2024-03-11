const ccxt = require('ccxt');

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class Protocol {
  constructor(exchange_name, symbol, apiKey, secret) {
    this.symbol = symbol;
    this.exchange_name = exchange_name
    if (ccxt[this.exchange_name] && typeof ccxt[this.exchange_name] === 'function') {
      this.exchangeClass = ccxt[this.exchange_name];
      this.exchange = new this.exchangeClass({
        'apiKey': apiKey,
        'secret': secret,
        "options": { 'defaultType': 'spot',
                        'recvWindow': 10000, }

      });
    } else {
      throw new Error(`Exchange class '${exchange_name}' not found or not a constructor.`);
    }
  }

  async get_price() {
    try {
      console.log('----------------------------------')
      const ticker = await this.exchange.fetchTicker(this.symbol);
      await delay(1000);
      console.log(`${this.symbol} Ticker:`, ticker);
      return ticker['ask'];
    } catch (error) {
      console.error('Error fetching ticker:', error);
      throw error;
    }
  }

  async placeOrder_buy(amount, price) {
    try {
      const order = await this.exchange.createOrder(this.symbol, 'limit', 'buy', amount, price);
      await delay(1000);
      console.log('Order placed:', order);
      return order;
    } catch (error) {
      console.error('Error placingBUY order:', error);
      throw error;
    }
  }
  async placeOrder_sell(amount, price) {
    try {
      const order = await this.exchange.createOrder(this.symbol, 'limit', 'sell', amount, price);
      await delay(1000);
      console.log('Order placed:', order);
      return order;
    } catch (error) {
      console.error('Error placingSELL order:', error);
      throw error;
    }
  }
  async get_id_info(id) {
    try {
      const order = await this.exchange.fetchClosedOrder(id, this.symbol);
      await delay(1000);
      console.log('Order info:', order);
      return order;
    } catch (error) {
      console.error('Error Order info::', error);
      throw error;
    }
  }


}

module.exports = Protocol;