import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  fetchTasks,
  addTask,
  deleteTask,
  editTask,
} from "../services/taskService";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [sortCriteria, setSortCriteria] = useState("date");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "pending",
  });
  const [editTaskData, setEditTaskData] = useState(null);

  // fetching tasks
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const tasksData = await fetchTasks();
        setTasks(tasksData);
      } catch {
        toast.error("Error fetching tasks!");
      }
    };
    loadTasks();
  }, []);

  // filters and sorting
  useEffect(() => {
    let tasksToDisplay = [...tasks];

    if (statusFilter) {
      tasksToDisplay = tasksToDisplay.filter(
        (task) => task.status === statusFilter
      );
    }

    if (sortCriteria === "date") {
      tasksToDisplay.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
    } else if (sortCriteria === "status") {
      tasksToDisplay.sort((a, b) => a.status.localeCompare(b.status));
    } else if (sortCriteria === "title") {
      tasksToDisplay.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredTasks(tasksToDisplay);
  }, [tasks, sortCriteria, statusFilter]);

  // delete task
  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch {
      toast.error("Error deleting task!");
    }
  };

  // add task
  const handleAddTask = async () => {
    try {
      if (!newTask.title.trim() || !newTask.description.trim()) {
        toast.error("Title and Description are required!");
        return;
      }

      const addedTask = await addTask(newTask);
      setTasks((prevTasks) => [...prevTasks, addedTask]); // Update tasks state
      setIsModalOpen(false);
      setNewTask({ title: "", description: "", status: "pending" }); // Reset form
      toast.success("Task added successfully!");
    } catch (error) {
      toast.error("Error adding task!");
      console.error("Add task error:", error);
    }
  };

  // open the edit modal with the task details
  const openEditModal = (task) => {
    setEditTaskData({ ...task }); // Copy task to editTaskData
    setIsEditModalOpen(true);
  };

  const handleEditTask = async () => {
    try {
      if (!editTaskData.title.trim() || !editTaskData.description.trim()) {
        toast.error("Title and Description are required!");
        return;
      }

      const updatedTask = await editTask(editTaskData._id, editTaskData);
      setTasks(
        tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
      );
      setIsEditModalOpen(false);
      toast.success("Task updated successfully!");
    } catch (error) {
      toast.error("Error updating task!");
      console.error("Edit task error:", error);
    }
  };

  return (
    <div className="p-6 mt-10">
      <h1 className="text-3xl text-center mt-2 font-bold ml-6 tracking-wider">
        Task List
      </h1>

      <div className="flex justify-between items-center mb-4 ">
        <div className="flex mb-4 gap-4">
          <select
            className="border p-2 rounded"
            onChange={(e) => setStatusFilter(e.target.value)}
            value={statusFilter}
          >
            <option value="">Filter by Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>

          <select
            className="border p-2 rounded"
            onChange={(e) => setSortCriteria(e.target.value)}
            value={sortCriteria}
          >
            <option value="">Sort</option>
            <option value="date">Date</option>
            <option value="status">Status</option>
            <option value="title">Title</option>
          </select>
        </div>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          Add New Task
        </button>
      </div>

      <table className="w-full mt-4 border-collapse border border-gray-300 text-center">
        <thead>
          <tr>
            <th className="border p-2">Task Id</th>
            <th className="border p-2">Title</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Timestamp</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task, index) => (
              <tr key={task._id}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{task.title}</td>
                <td className="border p-2">{task.description}</td>
                <td className="border p-2">
                  <select
                    value={task.status}
                    onChange={(e) => console.log(e)}
                    className="border p-1 rounded"
                  >
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </select>
                </td>
                <td className="border p-2">
                  {new Date(task.createdAt).toLocaleString()}
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => openEditModal(task)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4">
                No tasks available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* add new task model active on clicking add new task button */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center ">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 overflow-y-auto max-h-[68vh] ">
            <h2 className="text-xl font-bold mb-4">Add New Task</h2>
            <input
              type="text"
              placeholder="Title"
              className="border p-2 w-full mb-2"
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
            />
            <textarea
              placeholder="Description"
              className="border p-2 w-full mb-2"
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
            ></textarea>
            <select
              className="border p-2 w-full mb-2"
              onChange={(e) =>
                setNewTask({ ...newTask, status: e.target.value })
              }
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <div className="flex justify-end mt-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                onClick={handleAddTask}
              >
                Submit
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* edit task model active on clicking edit button on actions columns */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 overflow-y-auto max-h-[68vh]">
            <h2 className="text-xl font-bold mb-4">Edit Task</h2>
            <input
              type="text"
              className="border p-2 w-full mb-2"
              value={editTaskData?.title || ""}
              onChange={(e) =>
                setEditTaskData({
                  ...editTaskData,
                  title: e.target.value,
                })
              }
            />
            <textarea
              className="border p-2 w-full mb-2"
              value={editTaskData?.description || ""}
              onChange={(e) =>
                setEditTaskData({
                  ...editTaskData,
                  description: e.target.value,
                })
              }
            ></textarea>
            <select
              className="border p-2 w-full mb-2"
              value={editTaskData?.status || "pending"}
              onChange={(e) =>
                setEditTaskData({
                  ...editTaskData,
                  status: e.target.value,
                })
              }
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <div className="flex justify-end mt-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                onClick={handleEditTask}
              >
                Save
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setIsEditModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
