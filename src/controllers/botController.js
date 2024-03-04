const BotModel = require("../models/botModel");

async function insertGridBotData(botConfigData) {
  const existingBot = await BotModel.findOne({
    where: { bot_name: botConfigData.botName },
  });

  if (existingBot) {
    console.error(
      `Bot with name '${botConfigData.botName}' already exists.`
    );
    return null;
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
  try {
    const result = await BotModel.create(gridConfig);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function findOneByBotName(botName) {
  try {
    const bot = await BotModel.findOne({
      where: { bot_name: botName },
    });
    return bot;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function findAllBotData() {
  try {
    const allBotData = await BotModel.findAll({
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
    });
    return allBotData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function updateBotData(botName) {
  try {
    const currentBot = await BotModel.findOne({ where: { bot_name: botName } });

    if (!currentBot) {
      console.error(`Bot with name '${botName}' not found.`);
      return false;
    }

    const updatedStatus = !currentBot.status;

    await BotModel.update(
      { status: updatedStatus },
      { where: { bot_name: botName } }
    );

    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function setAllBotStatusesToFalse() {
  try {
    await BotModel.update(
      { status: false },
      { where: {} }
    );
    console.log("All bot statuses updated to false successfully.");
  } catch (error) {
    console.error("Error updating bot statuses:", error);
    throw error;
  }
}



async function deleteBotData(botName) {
  try {
    const deletedRowCount = await BotModel.destroy({
      where: { bot_name: botName },
    });

    if (deletedRowCount === 0) {
      console.error(`Bot with name '${botName}' not found.`);
      return false;
    }

    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  insertGridBotData,
  findOneByBotName,
  findAllBotData,
  updateBotData,
  deleteBotData,
  setAllBotStatusesToFalse,
};
