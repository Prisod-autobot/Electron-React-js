const { app, BrowserWindow, ipcMain } = require("electron");
const db_connect = require('../src/db/connf');

const { insertGridData, deleteGridData } = require('../src/controllers/gridController');
const { insertGridBotData, findAllBotData, findOneByBotName, updateBotData, deleteBotData, setAllBotStatusesToFalse } = require('../src/controllers/botController');

require('../src/models/botModel')
require('../src/models/gridHistoryModel')
require('../src/models/gridModel')
require('../src/models/reBalanceHistoryModel')
require('../src/models/reBalanceModel')

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

    mainWindow.loadURL("http://localhost:7070");

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
    ipcMain.on('form-data', async (event, data) => {
        try {
            await insertGridData(data);
            await insertGridBotData(data);

            event.sender.send("saveDataSuccess", "Data saved successfully");
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
        await updateBotData(botName);
        event.sender.send("updateDataSuccess", "Data updated successfully");
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