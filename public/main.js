const { app, BrowserWindow, ipcMain } = require("electron");
const db_connect = require('../src/db/connf');

// Import controllers
const { insertGridData, deleteGridData } = require('../src/controllers/gridController');
const { insertGridBotData, findAllBotData, findOneByBotName, updateBotData, deleteBotData } = require('../src/controllers/botController');

// Import models
require('../src/models/botModel');
require('../src/models/gridHistoryModel');
require('../src/models/gridModel');
require('../src/models/reBalanceHistoryModel');
require('../src/models/reBalanceModel');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        minWidth: 1280, // Minimum width added
        minHeight: 720, // Minimum height added
        maxWidth: 1280, // Minimum width added
        maxHeight: 720, // Minimum height added
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadURL("http://localhost:7070");

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

function setupEventListeners() {
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

    ipcMain.handle('get-all-data', async (event, args) => {
        try {
            return await findAllBotData();
        } catch (error) {
            console.error('Error retrieving data:', error);
            throw error;
        }
    });

    ipcMain.handle('get-one-data', async (event, data) => {
        try {
            return await findOneByBotName(data);
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
            event.sender.send("deleteDataSuccess", "Data deleted successfully");
        } catch (error) {
            console.error(error);
            event.sender.send("DataError", "Error saving data");
        }
    });
}

function initializeApp() {
    app.on("ready", () => {
        createWindow();
        setupEventListeners();
    });

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") app.quit();
    });

    app.on("activate", () => {
        if (mainWindow === null) createWindow();
    });
}

// Database connection and synchronization
db_connect
    .sync({ force: false })
    .then(() => {
        console.log('Synchronize successfully');
    })
    .catch((error) => {
        console.error('Error synchronizing models:', error);
    });

// Start the application
initializeApp();
