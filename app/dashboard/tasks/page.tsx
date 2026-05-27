"use client";
import { useAuth } from "../../context/AuthContent";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { SkeletonTask } from "../../components/Skeleton";


const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Task {
  _id: string;
  title: string;
  priority: "high" | "medium" | "low";
  status: "active" | "completed";
  createdAt: string;
}

const PRIORITY_COLORS = {
  high: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/20",
  },
  medium: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
  },
  low: {
    bg: "bg-gray-500/10",
    text: "text-gray-400",
    border: "border-gray-500/20",
  },
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
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <p style={{ color: "var(--text-secondary)" }}>Loading...</p>
      </div>
    );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <p className="mt-1" style={{ color: "var(--text-secondary)" }}>
          {activeTasks} active · {completedTasks} completed
        </p>
      </div>

      {/* Add Task */}
      <div
        className="rounded-xl p-4 border mb-6 flex flex-col sm:flex-row gap-3"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border)",
        }}
      >
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Add a new task..."
          className="flex-1 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          style={{
            backgroundColor: "var(--input-bg)",
            color: "var(--text-primary)",
          }}
        />
        <div className="relative w-32">
          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as "high" | "medium" | "low")
            }
            className="w-full rounded-lg pl-3 pr-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none border"
            style={{
              backgroundColor: "var(--input-bg)",
              color: "var(--text-primary)",
              borderColor: "var(--border)",
            }}
          >
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">⚪ Low</option>
          </select>
          <div
            className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
            style={{ color: "var(--text-secondary)" }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
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
            className="px-4 py-1.5 rounded-lg text-sm transition-colors capitalize"
            style={{
              backgroundColor: filter === f ? "var(--hover-bg)" : "transparent",
              color:
                filter === f ? "var(--text-primary)" : "var(--text-secondary)",
              fontWeight: filter === f ? "500" : "400",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Task List */}
      {loading ? (
        <SkeletonTask rows={4} />
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
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
              className={`rounded-xl p-4 border flex items-center gap-4 transition-opacity ${task.status === "completed" ? "opacity-60" : ""}`}
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border)",
              }}
            >
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

              <p
                className={`flex-1 text-sm ${task.status === "completed" ? "line-through" : ""}`}
                style={{
                  color:
                    task.status === "completed"
                      ? "var(--text-tertiary)"
                      : "var(--text-primary)",
                }}
              >
                {task.title}
              </p>

              <span
                className={`text-xs px-2 py-1 rounded-full capitalize flex-shrink-0 border ${PRIORITY_COLORS[task.priority].bg} ${PRIORITY_COLORS[task.priority].text} ${PRIORITY_COLORS[task.priority].border}`}
              >
                {task.priority}
              </span>

              <button
                onClick={() => deleteTask(task._id)}
                className="flex-shrink-0 text-sm transition-colors"
                style={{ color: "var(--text-tertiary)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#f87171")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--text-tertiary)")
                }
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
