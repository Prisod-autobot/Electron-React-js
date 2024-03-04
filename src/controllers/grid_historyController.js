const GridHistory = require('../models/gridHistoryModel.js');

async function insertGridHistoryData(gridhistoryData) {
    try {
        const result = await GridHistory.create(gridhistoryData);
        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function findOneByIdTransaction(idTransaction,botname) {
    try {
        const history = await GridHistory.findOne({
            where: { id_transaction: idTransaction,
                       bot_name : botname  },
        });
        return history;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function find_status_buy_open(botname) {
    try {
        const history = await GridHistory.findAll({
            where: { status_buy: 'open',
            bot_name : botname },
        });
        let arr = []
        for (let step = 0; step<history.length ; step++){
            let idbuy = history[step]['dataValues']['id_buy']
            arr.push(idbuy)
        }
        console.log("find_status_buy_open:"+arr)
        return arr;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function find_status_sell_open(botname) {
    try {
        const history = await GridHistory.findAll({
            where: { status_sell: 'open',
            bot_name : botname },
        });
        let arr = []
        for (let step = 0; step<history.length ; step++){
            let idsell = history[step]['dataValues']['id_sell']
            arr.push(idsell)
        }
        console.log("find_status_sell_open"+arr)
        return arr;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function updateGrid_idbuy(idbuy, updatedData) {
    try {
        const [updatedRowsCount, updatedRows] = await GridHistory.update(updatedData, {
            where: { id_buy: idbuy },
            returning: true, // Include the updated rows in the result
        });

        if (updatedRowsCount === 0 || !updatedRows || updatedRows.length === 0) {
            console.error(`History with id_transaction '${idbuy}' not found.`);
            return null;
        }
        console.log('-------------------')
        console.log(updatedRows[0])
        console.log('-------------------')
        //return updatedRows[0].get(); // Return the updated data
    } catch (error) {
        console.error(error);
        throw error;
    }
}


async function updateGrid_idsell(idsell, updatedData) {
    try {
        const [updatedRowsCount, updatedRows] = await GridHistory.update(updatedData, {
            where: { id_sell: idsell },
            returning: true, // Include the updated rows in the result
        });

        if (updatedRowsCount === 0 || !updatedRows || updatedRows.length === 0) {
            console.error(`History with id_transaction '${idselly}' not found.`);
            return null;
        }

        return updatedRows[0].get(); // Return the updated data
    } catch (error) {
        console.error(error);
        throw error;
    }
}





async function buy_logic(zone_index,botname) {
    try {
        const histories = await GridHistory.findAll({
            where: { zone: zone_index,bot_name : botname },
        });

        if (histories.length === 0) {
            return true;
        }
        const logic = histories.every(history => history.status_buy === 'closed' && history.status_sell === 'closed');
        return logic
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function sell_logic(zone_index,botname) {
    try {
        const histories = await GridHistory.findAll({
            where: { zone: zone_index ,bot_name : botname},
        });

        if (histories.length === 0) {
            return false; // No records found for the specified zone
        }

        const logic1 = histories.every(history => history.status_buy === 'closed' && history.status_sell === null);

        return logic1;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function list_wait_sell(botname) {
    try {
        const history = await GridHistory.findAll({
            where: { status_buy: 'closed', status_sell: null ,bot_name : botname},
        });
        let arr = []; 
        for (let step = 0; step < history.length; step++) {
            let idbuy = history[step]['dataValues']['id_buy'];
            let zone_index = history[step]['dataValues']['zone'];
            arr.push({ id_buy: idbuy, zone: zone_index });
        }
        console.log("list_wait_sell:", arr);
        return arr;
    } catch (error) {
        console.error(error);
        throw error;
    }
}








module.exports = {
    insertGridHistoryData,
    findOneByIdTransaction,
    find_status_buy_open,
    find_status_sell_open,
    updateGrid_idbuy,
    updateGrid_idsell,
    buy_logic,
    sell_logic,
    list_wait_sell

};
