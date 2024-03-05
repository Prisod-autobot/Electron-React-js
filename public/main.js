const { app, BrowserWindow, ipcMain } = require("electron");
const db_connect = require('../src/db/connf');
const path = require('path');
const { insertGridData, deleteGridData } = require('../src/controllers/gridController');
const { insertGridBotData, insertRebBotData, findAllBotData, findOneByBotName, updateBotData, deleteBotData, setAllBotStatusesToFalse } = require('../src/controllers/botController');
const { findAllBotTransaction } = require('../src/controllers/grid_historyController');
const { insertReBalanceData, deleteReBalanceData, } = require('../src/controllers/reBalanceController');
const { findAllBot } = require("../src/controllers/grid_historyController");

require('../src/models/botModel')
require('../src/models/gridHistoryModel')
require('../src/models/gridModel')
require('../src/models/reBalanceHistoryModel')
require('../src/models/reBalanceModel')
const Grid_bot = require('../src/backend/Grid_bot')

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
    app.isPackaged
        ? mainWindow.loadFile(path.join(__dirname, "index.html"))
        : mainWindow.loadURL("http://localhost:7070");


    mainWindow.on("closed", function () {
        mainWindow = null;
    });

}

db_connect
    .sync({ force: false })
    .then(async () => {
        console.log('Synchronize successfully')
    })
    .catch((error) => {
        console.error('Error synchronizing models:', error)
    })

app.on("ready", () => {
    createWindow();

    ipcMain.on('refocus-main-window', () => {
        if (mainWindow) {
            if (!mainWindow.isVisible()) mainWindow.show();
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });

    ipcMain.on('form-data', async (event, data) => {
        try {
            switch (data.grid_id) {
                case "Grid":
                    const gridConfig = {
                        grid_id: data.grid_id,
                        bot_name: data.botName,
                        api_key: data.apiKey,
                        api_secret: data.secretKey,
                        pair: data.pair,
                        exchange_name: data.exchangeName,
                        budget: parseFloat(data.budget),
                        up_zone: parseFloat(data.upZone),
                        low_zone: parseFloat(data.lowZone),
                        amount: parseFloat(data.amount),
                        grid_qty: parseInt(data.gridQuantity, 10),
                        grid_step: parseInt(data.gridStep, 10),
                        type_zone_calculation: parseInt(data.zoneCalculator, 10),
                    };
                    await insertGridData(gridConfig);
                    await insertGridBotData(gridConfig);

                    event.sender.send("saveDataSuccess", "Data saved successfully");
                    break;

                case "Rebalance": // Ensure this matches the incoming data.grid_id value exactly.
                    const reBalanceConfig = {
                        re_balance_id: data.grid_id,
                        bot_name: data.botName,
                        api_key: data.apiKey,
                        api_secret: data.secretKey,
                        pair: data.pair,
                        exchange_name: data.exchangeName,
                        budget: parseFloat(data.budget),
                        asset_ratio: parseFloat(data.asset_ratio),
                        cash_ratio: parseFloat(data.cash_ratio),
                        amount: parseFloat(data.amount),
                        difference: parseInt(data.difference, 10),
                    };

                    await insertReBalanceData(reBalanceConfig);
                    await insertRebBotData(reBalanceConfig);

                    event.sender.send("saveDataSuccess", "Data saved successfully");
                    break;


                default:
                    console.log("Unknown grid_id value: ", data.grid_id);
            }

        } catch (error) {
            console.error(error);
            event.sender.send("saveDataError", "Error saving data");
        }
    });
});

ipcMain.handle('get-all-data', async (event, args) => {
    try {
        const response = await findAllBotData();
        return response;
    } catch (error) {
        console.error('Error retrieving data:', error);
        throw error;
    }
});

ipcMain.handle('get-history-money', async (event, args) => {
    try {
        const response = await findAllBot();
        return response;
    } catch (error) {
        console.error('Error retrieving data:', error);
        throw error;
    }
});


ipcMain.handle('get-all-history-grid', async (event, data) => {
    try {
        const response = await findAllBotTransaction(data);
        return response;
    } catch (error) {
        console.error('Error retrieving data:', error);
        throw error;
    }
});

ipcMain.handle('get-one-data', async (event, data) => {
    try {
        const response = await findOneByBotName(data);
        return response;
    } catch (error) {
        console.error('Error retrieving data:', error);
        throw error;
    }
});

ipcMain.on('update-grid', async (event, { botName }) => {
    try {
        const kk = await updateBotData(botName);
        if (kk) {
            let grid_bot_instance = await new Grid_bot(botName)

            event.sender.send("updateDataSuccess", "Data updated successfully");
        }
        else {
            event.sender.send("updateDataSuccess", "Data updated successfully");
        }
    } catch (error) {
        console.error(error);
        event.sender.send("DataError", "Error saving data");
    }
});

ipcMain.on('delete-grid', async (event, { botName }) => {
    try {
        await deleteGridData(botName);
        await deleteBotData(botName);
        event.sender.send("deleteDataSuccess", "Data delete successfully");
    } catch (error) {
        console.error(error);
        event.sender.send("DataError", "Error saving data");
    }
});

ipcMain.on('delete-reba', async (event, { botName }) => {
    try {
        await deleteReBalanceData(botName);
        await deleteBotData(botName);
        event.sender.send("deleteDataSuccess", "Data delete successfully");
    } catch (error) {
        console.error(error);
        event.sender.send("DataError", "Error saving data");
    }
});


app.on("window-all-closed", async (event) => {
    event.preventDefault();

    try {
        await setAllBotStatusesToFalse();
        console.log("Bot status updated, app will now quit.");

        if (process.platform !== "darwin") app.quit();
    } catch (error) {
        console.error("Error setting bot statuses to false:", error);
        if (process.platform !== "darwin") app.quit();
    }

});


app.on("activate", function () {
    if (mainWindow === null) createWindow();
});