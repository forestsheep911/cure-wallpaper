/* eslint-disable no-console */
const { app, BrowserWindow, ipcMain } = require('electron')
const { KintoneRestAPIClient } = require('@kintone/rest-api-client')
const OSS = require('ali-oss')

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 280,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  win.loadFile('./dist/index.html')
  // win.webContents.openDevTools()
}


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

ipcMain.on('sendmessage', async (event, arg) => {
  event.reply('somemessage', JSON.stringify("{}"))
})