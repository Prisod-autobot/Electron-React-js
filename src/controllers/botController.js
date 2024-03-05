const BotModel = require("../models/botModel");

// Utility function to streamline error handling
async function handleDatabaseOperation(operation) {
  try {
    return await operation();
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
}

async function insertGridBotData(botConfigData) {
  return handleDatabaseOperation(async () => {
    const existingBot = await BotModel.findOne({
      where: { bot_name: botConfigData.bot_name },
    });

    if (existingBot) {
      const errorMessage = `Bot with name '${botConfigData.bot_name}' already exists.`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const gridConfig = {
      type_id: "G-",
      type_bot: botConfigData.grid_id,
      bot_name: botConfigData.bot_name,
      status: false,
      api_key: botConfigData.api_key,
      api_secret: botConfigData.api_secret,
      pair: botConfigData.pair,
      exchange_name: botConfigData.exchange_name,
      budget: parseFloat(botConfigData.budget),
    };

    return await BotModel.create(gridConfig);
  });
}

async function insertRebBotData(botConfigData) {
  return handleDatabaseOperation(async () => {
    const existingBot = await BotModel.findOne({
      where: { bot_name: botConfigData.bot_name },
    });

    if (existingBot) {
      const errorMessage = `Bot with name '${botConfigData.bot_name}' already exists.`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const gridConfig = {
      type_id: "R-",
      type_bot: botConfigData.re_balance_id,
      bot_name: botConfigData.bot_name,
      status: false,
      api_key: botConfigData.api_key,
      api_secret: botConfigData.api_secret,
      pair: botConfigData.pair,
      exchange_name: botConfigData.exchange_name,
      budget: parseFloat(botConfigData.budget),
    };

    return await BotModel.create(gridConfig);
  });
}

async function findOneByBotName(bot_name) {
  return handleDatabaseOperation(() => BotModel.findOne({
    where: { bot_name: bot_name },
  }));
}

async function findAllBotData() {
  return handleDatabaseOperation(() => BotModel.findAll({
    attributes: {
      exclude: [
        "api_key",
        "api_secret",
        "up_zone",
        "low_zone",
        "grid_quantity",
        "grid_step",
        "zone_calculator",
      ],
    },
  }));
}

async function updateBotData(bot_name) {
  return handleDatabaseOperation(async () => {
    const [updatedRowsCount] = await BotModel.update(
      { status: BotModel.sequelize.literal('NOT status') },
      { where: { bot_name: bot_name }, returning: true }
    );

    if (updatedRowsCount === 0) {
      const errorMessage = `Bot with name '${bot_name}' not found.`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    return true;
  });
}

async function setAllBotStatusesToFalse() {
  return handleDatabaseOperation(async () => {
    await BotModel.update({ status: false }, { where: {} });
    console.log("All bot statuses updated to false successfully.");
  });
}

async function deleteBotData(bot_name) {
  return handleDatabaseOperation(async () => {
    const deletedRowCount = await BotModel.destroy({
      where: { bot_name: bot_name },
    });

    if (deletedRowCount === 0) {
      const errorMessage = `Bot with name '${bot_name}' not found.`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    return true;
  });
}

module.exports = {
  insertGridBotData,
  insertRebBotData,
  findOneByBotName,
  findAllBotData,
  updateBotData,
  deleteBotData,
  setAllBotStatusesToFalse,
};
