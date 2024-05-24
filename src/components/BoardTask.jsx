import React, { useState } from "react";
import { API_URL, formatDate } from "../constants";
import { FaTrash, FaEdit } from "react-icons/fa";
const BoardTask = ({ title, description, dueDate, id }) => {
  const deleteTask = async (e, taskId) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      const result = await response.json();
      setSuccessMessage(result?.message);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error("Error deleting task:", error.message);
    }
  };
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editTask, setEditTask] = useState({
    title: title,
    description: description,
    dueDate: dueDate,
  });

  const onEditTask = (e, taskId) => {
    e.preventDefault();
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const updatedTask = {
      id,
      ...editTask,
    };
    try {
      const response = await fetch(`${API_URL}/tasks/update/${id}`, {
        method: 'PUT', // or 'PATCH' if your API uses that method
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const result = await response.json();
      setSuccessMessage(result.message);
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-indigo-500">
      <div className="flex items-center justify-between">
        <h5 className="font-bold text-lg text-indigo-700">{title}</h5>
        <div>
          <button
            className="mr-2 text-gray-600 hover:text-gray-700 focus:outline-none"
            onClick={(e) => onEditTask(e, id)}
          >
            <FaEdit />
          </button>

          <button
            className="text-red-600 hover:text-red-700 focus:outline-none"
            onClick={(e) => deleteTask(e, id)}
          >
            <FaTrash />
          </button>
        </div>
      </div>
      <p className="text-gray-700 mt-2">{description}</p>
      <p className="text-gray-500 mt-1 text-sm">
        Due Date: {formatDate(dueDate)}
      </p>
      {successMessage && (
        <div className="p-4 mt-4 text-green-800 bg-green-200 rounded">
          {successMessage}
        </div>
      )}

      {isEditing && (
        <div className="fixed inset-0 flex  items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white w-1/2 h-auto p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Edit Task</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={editTask.title}
                  onChange={handleEditChange}
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={editTask.description}
                  onChange={handleEditChange}
                  className="mt-1 p-2 w-full border rounded"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formatDate(editTask.dueDate)}
                  onChange={handleEditChange}
                  className="mt-1 p-2 w-full border rounded"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-2 px-4 py-2 bg-gray-500 text-white rounded"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardTask;
