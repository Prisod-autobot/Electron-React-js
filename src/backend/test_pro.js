const Protocol = require('./Protocol')


async function main(){
    exchange_name ="bybit"
    pair = "BTC/USDT"
    apikey = 'oQVEMrxCosmWX3eK3f'
    secretkey = 'ifKQdGPtSBbA94RIK7xXgWQ5wvWwVPRwki2N'
    protocol = new Protocol(exchange_name, pair,apikey,secretkey);
    await protocol.cancel_all_order()


}
main()



