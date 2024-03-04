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
      where: { bot_name: botConfigData.botName },
    });

    if (existingBot) {
      const errorMessage = `Bot with name '${botConfigData.botName}' already exists.`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const gridConfig = {
      type_id: "G-",
      type_bot: 'Grid',
      bot_name: botConfigData.botName,
      status: false,
      api_key: botConfigData.apiKey,
      api_secret: botConfigData.secretKey,
      pair: botConfigData.pair,
      exchange_name: botConfigData.exchangeName,
      budget: parseFloat(botConfigData.budget),
    };

    return await BotModel.create(gridConfig);
  });
}

async function findOneByBotName(botName) {
  return handleDatabaseOperation(() => BotModel.findOne({
    where: { bot_name: botName },
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

async function updateBotData(botName) {
  return handleDatabaseOperation(async () => {
    const [updatedRowsCount] = await BotModel.update(
      { status: BotModel.sequelize.literal('NOT status') },
      { where: { bot_name: botName }, returning: true }
    );

    if (updatedRowsCount === 0) {
      const errorMessage = `Bot with name '${botName}' not found.`;
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

async function deleteBotData(botName) {
  return handleDatabaseOperation(async () => {
    const deletedRowCount = await BotModel.destroy({
      where: { bot_name: botName },
    });

    if (deletedRowCount === 0) {
      const errorMessage = `Bot with name '${botName}' not found.`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    return true;
  });
}

module.exports = {
  insertGridBotData,
  findOneByBotName,
  findAllBotData,
  updateBotData,
  deleteBotData,
  setAllBotStatusesToFalse,
};
