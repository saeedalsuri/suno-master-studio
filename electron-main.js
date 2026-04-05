const { app, BrowserWindow } = require('electron');
const path = require('path');

// Disable hardware acceleration to prevent WebGL/GPU crashes
app.disableHardwareAcceleration();

app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');

// Get icon path based on whether app is packaged or not
function getIconPath() {
  if (app.isPackaged) {
    // In production, icon is in resources folder
    return path.join(process.resourcesPath, 'app', 'build', 'icon01.ico');
  }
  // In development, icon is in build folder
  return path.join(__dirname, 'build', 'icon01.ico');
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 900,
    minWidth: 900,
    minHeight: 700,
    icon: getIconPath(), // Set window icon
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Set app user model id for Windows taskbar
  app.setAppUserModelId('com.suno.promptmaker');

  if (!app.isPackaged) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  // Optional: Show icon in Windows taskbar
  if (process.platform === 'win32') {
    app.setUserTasks([
      {
        program: process.execPath,
        arguments: '--new-instance',
        iconPath: getIconPath(),
        iconIndex: 0,
        title: 'Suno Master Studio V6',
        description: 'SUNO V5 Compliant Prompt Maker'
      }
    ]);
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Set app name for about dialog (if supported)
if (typeof app.setApplicationName === 'function') {
  app.setApplicationName('Suno Master Studio V6');
}
