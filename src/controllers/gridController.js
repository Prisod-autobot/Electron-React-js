const GridModel = require('../models/gridModel');

// A helper function for executing database operations with error handling
async function executeDatabaseOperation(operation, errorMessage = '') {
    try {
        return await operation();
    } catch (error) {
        console.error(errorMessage, error);
        throw error; // Rethrow to handle the error outside if necessary
    }
}

async function insertGridData(botConfigData) {
    return executeDatabaseOperation(async () => {
        const existingBot = await GridModel.findOne({
            where: { bot_name: botConfigData.botName }
        });

        if (existingBot) {
            throw new Error(`Bot with name '${botConfigData.botName}' already exists.`);
        }

        const gridConfig = {
            grid_id: 'Grid',
            bot_name: botConfigData.botName,
            api_key: botConfigData.apiKey,
            api_secret: botConfigData.secretKey,
            pair: botConfigData.pair,
            exchange_name: botConfigData.exchangeName,
            budget: parseFloat(botConfigData.budget),
            up_zone: parseFloat(botConfigData.upZone),
            low_zone: parseFloat(botConfigData.lowZone),
            amount: parseFloat(botConfigData.amount),
            grid_qty: parseInt(botConfigData.gridQuantity, 10),
            grid_step: parseInt(botConfigData.gridStep, 10),
            type_zone_calculation: parseInt(botConfigData.zoneCalculator, 10),
        };

        const result = await GridModel.create(gridConfig);
        return result;
    }, 'Error inserting grid data:');
}

async function findOneByBotName(botName) {
    return executeDatabaseOperation(async () => {
        const bot = await GridModel.findOne({ where: { bot_name: botName } });
        return bot;
    }, 'Error fetching bot by name:');
}

async function findAllGridData() {
    return executeDatabaseOperation(async () => {
        const allGridData = await GridModel.findAll();
        return allGridData;
    }, 'Error fetching all grid data:');
}

async function updateGridData(botName, updatedData) {
    return executeDatabaseOperation(async () => {
        const [updatedRowsCount, updatedRows] = await GridModel.update(updatedData, {
            where: { bot_name: botName },
            returning: true,
        });

        if (updatedRowsCount === 0) {
            throw new Error(`Bot with name '${botName}' not found.`);
        }

        return updatedRows[0].get();
    }, 'Error updating grid data:');
}

async function deleteGridData(botName) {
    return executeDatabaseOperation(async () => {
        const deletedRowCount = await GridModel.destroy({
            where: { bot_name: botName }
        });

        if (deletedRowCount === 0) {
            throw new Error(`Bot with name '${botName}' not found.`);
        }

        return true;
    }, 'Error deleting grid data:');
}

module.exports = {
    insertGridData,
    findOneByBotName,
    findAllGridData,
    updateGridData,
    deleteGridData,
};
