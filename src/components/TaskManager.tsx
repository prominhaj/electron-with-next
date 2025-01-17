"use client";

import { useEffect, useState } from "react";
import { Task } from "../../electron";

const TaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });

  const fetchTasks = async () => {
    const fetchedTasks = await window.electron.task.read();
    setTasks(fetchedTasks);
  };

  const addTask = async () => {
    const task = {
      title: newTask.title,
      description: newTask.description || "",
      completed: false,
    };

    try {
      await window.electron.task.create(task);
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const updateTask = async (id: string) => {
    await window.electron.task.update(id, { completed: true });
    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    await window.electron.task.delete(id);
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="max-w-lg mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold text-center text-gray-800">
        Task Manager
      </h1>

      {/* Task Input Fields */}
      <div className="space-y-2">
        <input
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <input
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Task Description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
        />
      </div>

      {/* Add Task Button */}
      <div className="flex justify-center">
        <button
          className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onClick={addTask}
        >
          Add Task
        </button>
      </div>

      {/* Task List */}
      <ul className="space-y-3">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="flex justify-between items-center p-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50"
          >
            <span className="text-lg font-medium text-gray-700">
              {task.title}
            </span>
            <div className="space-x-2">
              <button
                className={`px-4 py-1 text-sm rounded-lg ${
                  task.completed
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-yellow-500 text-white hover:bg-yellow-600"
                }`}
                onClick={() => updateTask(task._id!)}
              >
                {task.completed ? "Completed" : "Pending"}
              </button>
              <button
                className="px-4 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                onClick={() => deleteTask(task._id!)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
