import Math from 'math'
const Protocol = require('./Protocol');
const reBalanceModel = require('../models/reBalanceModel');
const {
  insertreBalanceHistoryData,
  findLastTransactionBot
} = require('../controllers/reBalanceHistoryController');




class reBalance_bot {
  constructor(botname) {
    (async () => {
      try {
        this.botname = botname;
        this.bot_info = await reBalanceModel.findOne({ where: { bot_name: this.botname }, });
        console.log(this.bot_info);
        this.exchange_name = this.bot_info['exchange_name'].toLowerCase();
        this.pair = this.bot_info['pair'];
        this.apikey = this.bot_info['api_key'];
        this.budget = this.bot_info['budget']
        this.secretkey = this.bot_info['api_secret'];
        this.asset_ratio = this.bot_info['asset_ratio'];
        this.cash_ratio = this.bot_info['cash_ratio'];
        this.difference = this.bot_info['difference'];
        this.protocol = new Protocol(this.exchange_name, this.pair, this.apikey, this.secretkey);
        this.asset_value = this.budget * this.asset_ratio
        this.cash_value = this.budget * this.cash_ratio
      } catch (error) {
        console.error(error);
      } finally {
        await this.run_bot()
      }

    })();
  }

  async init_order() {
    try {
      let price = this.protocol.get_price()
      let amount = this.asset_value / price
      let order_info = this.protocol.placeOrder_buy(amount, price)
      let order_id = order_info['id']
      let data = {
        bot_name: this.botname,
        order_id: order_id,
        Asset_value: this.asset_value,
        Cash_value: this.asset_value,
        Price: price,
        Amount_asset: amount,
        Last_asset_value: 0,
        Rebalance_difference: 0,
      };
      await insertreBalanceHistoryData(data)
      while (await this.protocol.get_id_info(order_id) !== 'closed') { }
    } catch (error) {
      console.error(error);
    }

  }


  async run_bot() {
    try {
      await this.init_order()
      datainfo = await findLastTransactionBot(this.botname)
      old_price = datainfo['Price']
      new_price = await this.protocol.get_price()
      if (Math.abs(old_price - new_price) > this.difference && old_price - new_price > 0) {
        //ราคาตกซื้อเพิ่ม
        let price = new_price
        let ALLinv = (price * datainfo['Amount_asset'] + datainfo['Cash_value']) / 2
        let amount = ALLinv / price
        let order_info = await this.protocol.placeOrder_buy(amount, price)
        let order_id = order_info['id']
        let data = {
          bot_name: this.botname,
          order_id: order_id,
          Asset_value: ALLinv,
          Cash_value: ALLinv,
          Price: price,
          Amount_asset: amount,
          Last_asset_value: price * datainfo['Amount_asset'],
          Rebalance_difference: (old_price - new_price) * amount,
        };
        await insertreBalanceHistoryData(data)
        while (await this.protocol.get_id_info(order_id) !== 'closed') { }
      }
      else if (Math.abs(old_price - new_price) > this.difference && old_price - new_price < 0) {
        //ราคาเพิ่มขายออก
        let price = new_price
        let ALLinv = (price * datainfo['Amount_asset'] + datainfo['Cash_value']) / 2
        let amount = ALLinv / price
        let order_info = await this.protocol.placeOrder_sell(amount, price)
        let order_id = order_info['id']
        let data = {
          bot_name: this.botname,
          order_id: order_id,
          Asset_value: ALLinv,
          Cash_value: ALLinv,
          Price: price,
          Amount_asset: amount,
          Last_asset_value: price * datainfo['Amount_asset'],
          Rebalance_difference: (old_price - new_price) * amount,
        };
        await insertreBalanceHistoryData(data)
        while (await this.protocol.get_id_info(order_id) !== 'closed') { }
      }
    }

    catch (error) {
      console.error(error)
    }

  }



}
