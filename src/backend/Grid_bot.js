const GridModel = require('../models/gridModel');


const {
  insertGridHistoryData,
  find_status_buy_open,
  find_status_sell_open,
  updateGrid_idbuy,
  updateGrid_idsell,
  buy_logic,
  sell_logic,
  list_wait_sell
} = require('../controllers/grid_historyController');

const Protocol = require('./Protocol')


class Grid_bot {
  constructor(botname) {
    (async () => {
      try {
        this.botname = botname;
        this.bot_info = await GridModel.findOne({ where: { bot_name: this.botname }, });
        console.log(this.bot_info);
        this.exchange_name = this.bot_info['exchange_name'].toLowerCase();
        this.pair = this.bot_info['pair'];
        this.apikey = this.bot_info['api_key'];
        this.secretkey = this.bot_info['api_secret'];
        this.grid_qty = this.bot_info['grid_qty'];
        this.grid_step = this.bot_info['grid_step'];
        this.type_zone_calculation = this.bot_info['type_zone_calculation'];
        this.up_zone = this.bot_info['up_zone'];
        this.low_zone = this.bot_info['low_zone'];
        this.amount_buy = this.bot_info['amount'] * 1.03;
        this.amount_sell = this.bot_info['amount'] * 0.99;
        this.protocol = new Protocol(this.exchange_name, this.pair, this.apikey, this.secretkey);
        this.grid_zone_buy = await this.create_zone_buy(); // Initialize grid_zone_buy
        this.grid_zone_sell = await this.create_zone_sell();

      } catch (error) {
        console.error(error);
      } finally {
        await this.run_bot()
      }

    })();
  }

  async create_zone_buy() {
    if (this.type_zone_calculation === 1) {
      let arr = [];
      let step = (this.up_zone - this.low_zone) / (this.grid_qty - 1);
      for (let i = 0; i < this.grid_qty; i++) {
        arr.push(this.low_zone + step * i);
      }
      return arr;
    } else {
      const range = function (start, stop, step) {
        step = step || 1;
        let arr = [];
        for (let i = start; i < stop; i += step) {
          arr.push(i);
        }
        return arr;
      };
      return range(this.low_zone, this.up_zone, this.grid_step);
    }
  }

  async create_zone_sell() {
    if (this.type_zone_calculation === 1) {
      let arr = [];
      let step = (this.up_zone - this.low_zone) / (this.grid_qty - 1);
      for (let i = 1; i <= this.grid_qty; i++) {
        arr.push(this.low_zone + step * i);
      }
      return arr;
    } else {
      // Fixed the syntax issue here
      const range = function (start, stop, step) {
        step = step || 1;
        let arr = [];
        for (let i = start + step; i < stop + step; i += step) {
          arr.push(i);
        }
        return arr;
      };
      return range(this.low_zone, this.up_zone, this.grid_step);
    }
  }

  async buy_and_check() {
    try {
      for (let step = 0; step < this.grid_zone_buy.length; step++) {
        let price = await this.protocol.get_price(); // Declare 'price' here
        if (await buy_logic(step, this.botname) && this.grid_zone_buy[step] < price) {
          let order_info = await this.protocol.placeOrder_buy(this.amount_buy, this.grid_zone_buy[step]);
          let data = {
            bot_name: this.botname,
            id_buy: order_info['id'],
            date_buy: order_info['datetime'],
            pair: this.pair,
            total_cost_buy: this.amount_buy * this.grid_zone_buy[step],
            status_buy: 'open',
            zone: step,
            amount: this.amount_buy,
            price_buy: this.grid_zone_buy[step],
            bot_id: this.bot_id
          };
          await insertGridHistoryData(data); // Ensure you await the function call
        }
      }
      let list_open_idbuy = await find_status_buy_open(this.botname)
      console.log('--------------------')
      console.log(list_open_idbuy)
      console.log('--------------------')
      list_open_idbuy.forEach(async (id) => {
        let idbuy_info = await this.protocol.get_id_info(id);
        let idbuy_status = idbuy_info['status'];
        if (idbuy_status === 'closed') {
          let data_status = { status_buy: 'closed' };
          await updateGrid_idbuy(id, data_status);
        }
      });
    } catch (error) {
      console.error(error)
    }
  }

  async sell_and_check() {
    try {
      const list = await list_wait_sell(this.botname);
      list.forEach(async (item) => {
        let zone = item['zone'];
        let price = await this.protocol.get_price();
        if (price < this.grid_zone_sell[zone] && await sell_logic(zone, this.botname)) {
          let order_info = await this.protocol.placeOrder_sell(this.amount_sell, this.grid_zone_sell[zone]);
          let data = {
            id_sell: order_info['id'],
            status_sell: 'open',
            date_sell: order_info['datetime']
          };
          await updateGrid_idbuy(item['id_buy'], data);
        }
      });

      let list_open_idsell = await find_status_sell_open(this.botname);
      list_open_idsell.forEach(async (id) => {
        let idsell_info = await this.protocol.get_id_info(id);
        let idsell_status = idsell_info['status'];
        if (idsell_status === 'closed') {
          let data_status = { status_sell: 'closed' };
          await updateGrid_idsell(id, data_status);
        }
      });
    } catch (error) {
      console.error(error)
    }
  }

  async run_bot() {
    try {
      while (true) {
        await this.buy_and_check()
        console.log("Still Working")
        await this.sell_and_check()
      }
    } catch (error) {
      console.error(error)
    }

  }
}

module.exports = Grid_bot;
