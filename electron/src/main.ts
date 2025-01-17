import { is } from "@electron-toolkit/utils";
import { app, BrowserWindow, ipcMain } from "electron";
import { getPort } from "get-port-please";
import { startServer } from "next/dist/server/lib/start-server";
import { join } from "path";
import { chromium } from "playwright";
import { connectDB } from "../../database";
import { Task, ITask } from "../../models/Task";

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  mainWindow.on("ready-to-show", () => mainWindow.show());

  const loadURL = async () => {
    if (is.dev) {
      mainWindow.loadURL("http://localhost:3000");
    } else {
      try {
        const port = await startNextJSServer();
        console.log("Next.js server started on port:", port);
        mainWindow.loadURL(`http://localhost:${port}`);
      } catch (error) {
        console.error("Error starting Next.js server:", error);
      }
    }
  };

  loadURL();
  return mainWindow;
};

const startNextJSServer = async () => {
  try {
    const nextJSPort = await getPort({ portRange: [30_011, 50_000] });
    const webDir = join(app.getAppPath(), "app");

    await startServer({
      dir: webDir,
      isDev: false,
      hostname: "localhost",
      port: nextJSPort,
      customServer: true,
      allowRetry: false,
      keepAliveTimeout: 5000,
      minimalMode: true,
    });

    return nextJSPort;
  } catch (error) {
    console.error("Error starting Next.js server:", error);
    throw error;
  }
};

app.whenReady().then(async () => {
  // Connect to MongoDB
  await connectDB();

  createWindow();

  // Playwright Integration: IPC Handler
  ipcMain.handle("playwright-fetch-content", async (_, url: string) => {
    try {
      console.log(`Fetching visible content from URL: ${url}`);
      const browser = await chromium.launch({
        headless: false,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      const page = await browser.newPage();
      await page.goto(url);
      const content = await page.evaluate(() => {
        // Extract all visible text from the body of the webpage
        return document.body.innerText.trim();
      });
      await browser.close();
      // const newTask = await Content.create({
      //   content: content
      // });
      return content;
    } catch (error) {
      console.error("Error fetching content with Playwright:", error);
      throw error;
    }
  });

  // Handle CRUD IPC events
  ipcMain.handle("task:create", async (_, taskData) => {
    try {
      // Save the task to MongoDB
      const newTask = await Task.create(taskData);
      return JSON.parse(JSON.stringify(newTask));
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  });
  

  ipcMain.handle("task:read", async () => {
    try {
      const tasks = await Task.find().lean();
      return JSON.parse(JSON.stringify(tasks));
    } catch (error) {
      console.error("Error reading tasks:", error);
      throw error;
    }
  });

  ipcMain.handle(
    "task:update",
    async (_, id: string, updates: Partial<ITask>) => {
      try {
        const updatedTask = await Task.findByIdAndUpdate(id, updates, {
          new: true,
        });
        return updatedTask;
      } catch (error) {
        console.error("Error updating task:", error);
        throw error;
      }
    }
  );

  ipcMain.handle("task:delete", async (_, id: string) => {
    try {
      const result = await Task.findByIdAndDelete(id);
      return result;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
