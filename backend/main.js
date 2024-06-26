const { BrowserWindow, app, Menu, MenuItem } = require("electron");
const path = require("path");
const { shell } = require("electron");

// Starting express
require("./server-electron.js");

// Setting port
const PORT = process.env.WEB_SERVER_PORT || 5000;

let mainWindow = null;

const options = {
  title: "Some Node",
  show: false,
  width: 1024,
  height: 768,
};

if (process.platform === "linux") options.icon = path.join(__dirname, "./icon/icon.png");

function main() {
  const defaultMenu = Menu.getApplicationMenu();

  const newMenu = new Menu();
  defaultMenu.items
    .filter((x) => !(x.role === "help" || x.role === "windowmenu" || x.role === "editmenu"))
    .forEach((x) => {
      if (x.role === "viewmenu") {
        const newSubmenu = new Menu();

        x.submenu.items.filter((y) => y.role !== "toggledevtools").forEach((y) => newSubmenu.append(y));

        x.submenu = newSubmenu;

        newMenu.append(
          new MenuItem({
            type: x.type,
            label: x.label,
            submenu: newSubmenu,
          })
        );
      } else {
        newMenu.append(x);
      }
    });

  const newSubmenu = new Menu();

  Menu.setApplicationMenu(newMenu);

  mainWindow = new BrowserWindow(options);
  mainWindow.maximize();
  mainWindow.loadURL(`http://127.0.0.1:${PORT}`);
  mainWindow.on("close", (event) => {
    mainWindow = null;
  });

  mainWindow.on("page-title-updated", function (e) {
    e.preventDefault();
  });
}

app.on("ready", main);
