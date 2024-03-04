const GridHistory = require('../models/gridHistoryModel.js');

// A helper function to handle repeating try-catch logic
async function executeDbOperation(operation) {
    try {
        return await operation();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function insertGridHistoryData(gridHistoryData) {
    return executeDbOperation(() => GridHistory.create(gridHistoryData));
}

async function findOneByIdTransaction(idTransaction, botName) {
    return executeDbOperation(() => GridHistory.findOne({
        where: { id_transaction: idTransaction, bot_name: botName },
    }));
}

async function findAllBotTransaction(botName) {
    return executeDbOperation(() => GridHistory.findAll({
        where: { bot_name: botName },
    }));
}

async function findAllBot() {
    return executeDbOperation(() => GridHistory.findAll());
}

async function findStatusOpen(type, botName) {
    const key = `status_${type}`; // dynamic key based on type (buy or sell)
    return executeDbOperation(async () => {
        const history = await GridHistory.findAll({
            where: { [key]: 'open', bot_name: botName },
        });
        return history.map(item => item.dataValues[`id_${type}`]);
    });
}

async function updateGridId(type, id, updatedData) {
    const key = `id_${type}`; // dynamic key based on type (buy or sell)
    return executeDbOperation(async () => {
        const [updatedRowsCount, updatedRows] = await GridHistory.update(updatedData, {
            where: { [key]: id },
            returning: true,
        });
        if (updatedRowsCount === 0) {
            console.error(`History with id_transaction '${id}' not found.`);
            return null;
        }
        return updatedRows[0].get();
    });
}

async function transactionLogic(zoneIndex, botName, operation) {
    return executeDbOperation(async () => {
        const histories = await GridHistory.findAll({
            where: { zone: zoneIndex, bot_name: botName },
        });
        if (operation === 'buy' && histories.length === 0) return true;
        if (operation === 'sell' && histories.length === 0) return false;

        const condition = operation === 'buy' ?
            history => history.status_buy === 'closed' && history.status_sell === 'closed' :
            history => history.status_buy === 'closed' && history.status_sell === null;

        return histories.every(condition);
    });
}

async function listWaitSell(botName) {
    return executeDbOperation(async () => {
        const history = await GridHistory.findAll({
            where: { status_buy: 'closed', status_sell: null, bot_name: botName },
        });
        return history.map(item => ({
            id_buy: item.dataValues.id_buy,
            zone: item.dataValues.zone
        }));
    });
}

module.exports = {
    insertGridHistoryData,
    findOneByIdTransaction,
    findAllBotTransaction,
    findAllBot,
    find_status_buy_open: botName => findStatusOpen('buy', botName),
    find_status_sell_open: botName => findStatusOpen('sell', botName),
    updateGrid_idbuy: (idbuy, updatedData) => updateGridId('buy', idbuy, updatedData),
    updateGrid_idsell: (idsell, updatedData) => updateGridId('sell', idsell, updatedData),
    buy_logic: (zoneIndex, botName) => transactionLogic(zoneIndex, botName, 'buy'),
    sell_logic: (zoneIndex, botName) => transactionLogic(zoneIndex, botName, 'sell'),
    list_wait_sell: listWaitSell,
};
