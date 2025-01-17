import { NextResponse } from "next/server";
import { _electron as electron } from "playwright";

export const POST = async (req: Request) => {
  try {
    // Launch Electron app.
    const electronApp = await electron.launch({ args: ["build/main.js"] });

    // Evaluation expression in the Electron context.
    const appPath = await electronApp.evaluate(async ({ app }) => {
      // This runs in the main Electron process, parameter here is always
      // the result of the require('electron') in the main app script.
      return app.getAppPath();
    });

    // Get the first window that the app opens, wait if necessary.
    const window = await electronApp.firstWindow();
    // Print the title.
    console.log(await window.title());
    window.goto("https://www.google.com");
    // Direct Electron console to Node terminal.
    window.on("console", console.log);

    return NextResponse.json({
      message: "Server is running and Electron app is launched",
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
    });
  }
};
