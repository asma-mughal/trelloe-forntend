import React, { useEffect, useState } from "react";
import { API_URL } from "../constants";
import { useLocation } from "react-router-dom";
import { formatDate } from "../constants";
const ListTask = () => {
  const [tasks, setTasks] = useState([]);
  const location = useLocation(); // Get location object
  const { userId } = location?.state;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBoard, setSelectedBoard] = useState('');
  useEffect(() => {
    fetch(`${API_URL}/tasks/${userId}/listTask`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setTasks(data?.tasks);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, [tasks]);
  const filteredTasks = tasks?.filter(task =>
    (task?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    task?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase())) &&
    (!selectedBoard || task?.board?.name === selectedBoard)
  );

  // Get unique board names
  const boardNames = Array?.from(new Set(tasks.map(task => task?.board?.name)));

  return (
    <div className="bg-indigo-100 p-8 rounded-lg shadow-lg">
      <h2 className="text-black text-2xl mb-4">All Tasks</h2>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by title or description"
        className="block w-full px-4 py-2 mb-4 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-indigo-200"
      />
      <select
        value={selectedBoard}
        onChange={(e) => setSelectedBoard(e.target.value)}
        className="block w-full px-4 py-2 mb-4 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-indigo-200"
      >
        <option value="">All Boards</option>
        {boardNames?.map(boardName => (
          <option key={boardName} value={boardName}>{boardName}</option>
        ))}
      </select>

      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left py-2 px-4 bg-indigo-200">Title</th>
            <th className="text-left py-2 px-4 bg-indigo-200">Description</th>
            <th className="text-left py-2 px-4 bg-indigo-200">Board</th>
            <th className="text-left py-2 px-4 bg-indigo-200">Due Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks?.map(task => (
            <tr key={task.id}>
              <td className="py-2 px-4">{task.title}</td>
              <td className="py-2 px-4">{task.description}</td>
              <td className="py-2 px-4">{task.board.name}</td>
              <td className="py-2 px-4">{formatDate(task.dueDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListTask;
