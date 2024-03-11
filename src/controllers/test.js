const Protocol = require('../backend/Protocol');

async function fetchPrice() {
    try {
        const protocol = new Protocol('bybit', 'BTC/USDT', 'oQVEMrxCosmWX3eK3f', 'ifKQdGPtSBbA94RIK7xXgWQ5wvWwVPRwki2N')
        const ticker = await protocol.get_price()
        console.log(ticker);
    } catch (error) {
        console.error('Error fetching price:', error);
    }
}

fetchPrice();



