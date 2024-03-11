const reBalanceHistory = require('../models/reBalanceHistoryModel.js');

// A helper function to handle repeating try-catch logic
async function executeDbOperation(operation) {
    try {
        return await operation();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function insertreBalanceHistoryData(rebalanceHistoryData) {
    return executeDbOperation(() => reBalanceHistory.create(rebalanceHistoryData));
}

async function findOneByIdTransaction(idTransaction, botName) {
    return executeDbOperation(() => reBalanceHistory.findOne({
        where: { id_transaction: idTransaction, bot_name: botName },
    }));
}

async function findAllBotTransaction(botName) {
    return executeDbOperation(() => reBalanceHistory.findAll({
        where: { bot_name: botName },
    }));
}

async function findAllBotRe() {
    return executeDbOperation(() => reBalanceHistory.findAll());
}

async function findStatusOpen(type, botName) {
    const key = `status_${type}`; // dynamic key based on type (buy or sell)
    return executeDbOperation(async () => {
        const history = await reBalanceHistory.findAll({
            where: { [key]: 'open', bot_name: botName },
        });
        return history.map(item => item.dataValues[`id_${type}`]);
    });
}

async function updatereBalanceId(type, id, updatedData) {
    const key = `id_${type}`; // dynamic key based on type (buy or sell)
    return executeDbOperation(async () => {
        const [updatedRowsCount, updatedRows] = await reBalanceHistory.update(updatedData, {
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
        const histories = await reBalanceHistory.findAll({
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

async function findLastTransactionBot(botName) {
    return executeDbOperation(async () => {
        const lastTransaction = await reBalanceHistory.findOne({
            where: { bot_name: botName }, // Filter by bot_name
            order: [['createdAt', 'DESC']], // Order by createdAt descending (newest first)
            limit: 1, // Limit to 1 result (last transaction)
        });


        return lastTransaction['dataValues']; // Return the last transaction
    });
}



module.exports = {
    insertreBalanceHistoryData,
    findOneByIdTransaction,
    findAllBotTransaction,
    findAllBotRe,
    findLastTransactionBot,

};
