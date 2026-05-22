"use client";
import { useAuth } from "../../context/AuthContent";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Task {
  _id: string;
  title: string;
  priority: "high" | "medium" | "low";
  status: "active" | "completed";
  createdAt: string;
}

const PRIORITY_STYLES = {
  high: "bg-red-500/10 text-red-400 border border-red-500/20",
  medium: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  low: "bg-gray-500/10 text-gray-400 border border-gray-500/20",
};

export default function TasksPage() {
  const { isAuthenticated, initialLoading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!initialLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, initialLoading]);

  useEffect(() => {
    if (!initialLoading && isAuthenticated) {
      fetchTasks();
    }
  }, [initialLoading, isAuthenticated]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/tasks`, {
        withCredentials: true,
      });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      setAdding(true);
      const res = await axios.post(
        `${API_URL}/api/tasks`,
        { title: newTask, priority },
        { withCredentials: true },
      );
      setTasks([res.data, ...tasks]);
      setNewTask("");
      setPriority("medium");
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const toggleStatus = async (task: Task) => {
    try {
      const newStatus = task.status === "active" ? "completed" : "active";
      const res = await axios.patch(
        `${API_URL}/api/tasks/${task._id}`,
        { status: newStatus },
        { withCredentials: true },
      );
      setTasks(tasks.map((t) => (t._id === task._id ? res.data : t)));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/api/tasks/${id}`, {
        withCredentials: true,
      });
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  const activeTasks = tasks.filter((t) => t.status === "active").length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;

  if (initialLoading)
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <p className="text-gray-400 mt-1">
          {activeTasks} active · {completedTasks} completed
        </p>
      </div>

      {/* Add Task */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-6 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a new task..."
          className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600"
        />
        <div className="relative w-32">
          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as "high" | "medium" | "low")
            }
            className="w-full bg-gray-800 text-white rounded-lg pl-3 pr-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none border border-transparent focus:border-transparent"
          >
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">⚪ Low</option>
          </select>

          {/* Custom Arrow positioned perfectly */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </div>
        </div>

        <button
          onClick={addTask}
          disabled={adding || !newTask.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          {adding ? "Adding..." : "+ Add Task"}
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {(["all", "active", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm transition-colors capitalize ${
              filter === f
                ? "bg-gray-800 text-white font-medium"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Task List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-400">Loading tasks...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-sm">
            {filter === "all"
              ? "No tasks yet — add one above!"
              : `No ${filter} tasks`}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className={`bg-gray-900 rounded-xl p-4 border border-gray-800 flex items-center gap-4 transition-opacity ${
                task.status === "completed" ? "opacity-60" : ""
              }`}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleStatus(task)}
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                  task.status === "completed"
                    ? "bg-green-500 border-green-500"
                    : "border-gray-600 hover:border-green-500"
                }`}
              >
                {task.status === "completed" && (
                  <span className="text-white text-xs">✓</span>
                )}
              </button>

              {/* Title */}
              <p
                className={`flex-1 text-sm ${
                  task.status === "completed"
                    ? "line-through text-gray-500"
                    : "text-white"
                }`}
              >
                {task.title}
              </p>

              {/* Priority badge */}
              <span
                className={`text-xs px-2 py-1 rounded-full capitalize flex-shrink-0 ${PRIORITY_STYLES[task.priority]}`}
              >
                {task.priority}
              </span>

              {/* Delete button */}
              <button
                onClick={() => deleteTask(task._id)}
                className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0 text-sm"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
