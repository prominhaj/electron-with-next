// electron-window.d.ts
export interface Task {
  _id?: string;
  title: string;
  description?: string;
  completed: boolean;
}

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        send: (channel: string, ...args: any[]) => void;
      };
      playwright: {
        fetchPageContent: (url: string) => Promise<string>;
      };
      task: {
        create: (taskData: Partial<Task>) => Promise<Task>;
        read: () => Promise<Task[]>;
        update: (id: string, updates: Partial<Task>) => Promise<Task>;
        delete: (id: string) => Promise<Task>;
      };
    };
  }
}

export {};
