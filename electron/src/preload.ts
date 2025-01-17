import { contextBridge, ipcRenderer } from "electron";
import { ITask } from "../../models/Task";

contextBridge.exposeInMainWorld("electron", {
  playwright: {
    fetchPageContent: async (url: string): Promise<string> => {
      return ipcRenderer.invoke("playwright-fetch-content", url);
    },
  },
  task: {
    create: (taskData: Partial<ITask>) =>
      ipcRenderer.invoke("task:create", JSON.parse(JSON.stringify(taskData))),
    read: () => ipcRenderer.invoke("task:read"),
    update: (id: string, updates: Partial<ITask>) =>
      ipcRenderer.invoke("task:update", id, updates),
    delete: (id: string) => ipcRenderer.invoke("task:delete", id),
  }
});
