const { app, BrowserWindow, ipcMain } = require('electron');
const os = require("os");
const path = require('path');
const forWin = require("./forWin");

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 1200,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.loadFile('index.html')

  win.on('ready-to-show', function () {
    win.show() 
    win.openDevTools();
  })
}
app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('getInstalledInfo', (event, args) => {
  if (os.platform != 'win32') {
    event.returnValue = {code: 1 ,message: "Only work on windows now." };
  } else {
    console.log('receive Ping!')
    //Todo fetch installed  here
     forWin.fetchInstalled().then(data => {
        event.returnValue = {code:0,message:"fetchInstalled success!",data};
     }).catch( err => {
        event.returnValue = {code:1,message:err};
     });
  }

});
