const ReBalanceConfig = require("../models/reBalanceModel")

// A helper function for executing database operations with error handling
async function executeDatabaseOperation(operation, errorMessage = '') {
    try {
        return await operation();
    } catch (error) {
        console.error(errorMessage, error);
        throw error; // Rethrow to handle the error outside if necessary
    }
}

async function insertReBalanceData(botConfigData) {
    return executeDatabaseOperation(async () => {
        const existingBot = await ReBalanceConfig.findOne({
            where: { bot_name: botConfigData.bot_name }
        });

        if (existingBot) {
            throw new Error(`Bot with name '${botConfigData.bot_name}' already exists.`);
        }

        const result = await ReBalanceConfig.create(botConfigData);
        return result;
    }, 'Error inserting re-balance data:');
}

async function findOneByBotName(bot_name) {
    return executeDatabaseOperation(async () => {
        const bot = await ReBalanceConfig.findOne({ where: { bot_name: bot_name } });
        return bot;
    }, 'Error fetching bot by name:');
}

async function findAllReBalanceData() {
    return executeDatabaseOperation(async () => {
        const allGridData = await ReBalanceConfig.findAll();
        return allGridData;
    }, 'Error fetching all grid data:');
}

async function updateReBalanceData(bot_name, updatedData) {
    return executeDatabaseOperation(async () => {
        const [updatedRowsCount, updatedRows] = await ReBalanceConfig.update(updatedData, {
            where: { bot_name: bot_name },
            returning: true,
        });

        if (updatedRowsCount === 0) {
            throw new Error(`Bot with name '${bot_name}' not found.`);
        }

        return updatedRows[0].get();
    }, 'Error updating grid data:');
}

async function deleteReBalanceData(bot_name) {
    return executeDatabaseOperation(async () => {
        const deletedRowCount = await ReBalanceConfig.destroy({
            where: { bot_name: bot_name }
        });

        if (deletedRowCount === 0) {
            throw new Error(`Bot with name '${bot_name}' not found.`);
        }

        return true;
    }, 'Error deleting grid data:');
}

module.exports = {
    insertReBalanceData,
    findOneByBotName,
    findAllReBalanceData,
    updateReBalanceData,
    deleteReBalanceData,
};
