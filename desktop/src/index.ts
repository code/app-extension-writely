import { app, BrowserWindow, Tray, Menu, nativeImage } from 'electron'
import { getSelectedText, registerShortcut } from 'electron-selected-text'
// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit()
}

const printSelectedText = (selectedText: string) => {
  console.log(`Selected Text: ${selectedText}`)
}

//   getSelectedText().then(printSelectedText);

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  })

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
let tray
app.on('ready', () => {
  const ret = registerShortcut('Alt+w', printSelectedText)

  if (!ret) {
    console.warn('registration failed')
  }
  const icon = nativeImage
    .createFromPath('src/icon.png')
    .resize({ width: 16, height: 16 })
  tray = new Tray(icon)

  // note: your contextMenu, Tooltip and Title code will go here!
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Settings',
      type: 'normal',
      click: () => {
        createWindow()
      },
    },
    {
      label: 'Help',
      type: 'normal',
      click: () => {
        let win = new BrowserWindow({ width: 800, height: 600 })
        win.loadURL('https://github.com/anc95/writely')
      },
    },
    // https://www.electronjs.org/docs/latest/api/app#appsetloginitemsettingssettings-macos-windows
    // { label: 'Launch at login', type: 'radio', checked: true },
    { label: 'Quit', type: 'normal', click: () => app.quit() },
  ])

  tray.setContextMenu(contextMenu)
  tray.setToolTip('Writely')
  // tray.setTitle('Writely')
})

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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
