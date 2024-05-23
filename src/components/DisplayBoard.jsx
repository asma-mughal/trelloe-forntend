import React, { useEffect, useState } from "react";
import { API_URL } from "../constants";
import BoardTask from "./BoardTask";
import { FaTrash } from "react-icons/fa";
const DisplayBoard = ({ userId }) => {
  const [boards, setBoards] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState();
  ///list/:userId
  useEffect(() => {
    fetchBoards();
  }, [userId, boards]);
  const fetchBoards = () => {
    fetch(`${API_URL}/boards/list/${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setBoards(data?.boards);
      })
      .catch((error) => {
        console.error("There was a problem fetching the boards:", error);
      });
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const handleAddTask = (e, boardId) => {
    setSelectedBoardId(boardId);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewTask({
      ...newTask,
      [name]: value,
    });
  };
  const handleSubmitTask = (e) => {
    e.preventDefault();

    fetch(`${API_URL}/tasks/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        board: selectedBoardId,
        title: newTask.title,
        description: newTask.description,
        dueDate: newTask.dueDate,
        userId: userId,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save task");
        }
        setIsModalOpen(false);
        setNewTask({
          title: "",
          description: "",
          dueDate: "",
        });
      })
      .catch((error) => {
        console.error("Error saving task:", error);
      });
  };
  const [tasks, setTasks] = useState({});

  useEffect(() => {
    fetchTasksForAllBoards();
  }, [boards]);

  const fetchTasksForAllBoards = () => {
    boards.forEach((board) => {
      fetchTasksForBoard(board._id);
    });
  };

  const fetchTasksForBoard = (boardId) => {
    ///:boardId/tasks
    fetch(`${API_URL}/tasks/${boardId}/tasks`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch tasks for board");
        }
        return response.json();
      })
      .then((data) => {
        setTasks((prevTasks) => ({
          ...prevTasks,
          [boardId]: data?.tasks,
        }));
      })
      .catch((error) => {
        console.error("Error fetching tasks for board:", error);
        // Handle error, e.g., display error message to the user
      });
  };
  const handleDeleteBoard = async (id) => {
    try {
      const response = await fetch(`${API_URL}/boards/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete board");
      }
      console.log("Board deleted successfully");
    } catch (error) {
      console.error("Error deleting board:", error.message);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Boards</h2>
      {boards?.length === 0 ? (
        <p>No boards available. Add a board to get started.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {boards?.map((board) => (
            <div
              key={board?._id}
              className="bg-white rounded-lg overflow-auto shadow-md flex flex-col max-h-[600px]"
            >
              <div className="p-4 flex-grow flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">{board.name}</h3>
                  <button
                    onClick={() => handleDeleteBoard(board._id)}
                    className="text-red-600 hover:text-red-700 focus:outline-none"
                  >
                    <FaTrash />
                  </button>
                </div>
                <div className="pb-4 flex-grow">
                  <h4 className="text-base font-normal mb-2">Tasks</h4>
                  {tasks[board._id]?.length === 0 ? (
                    <p>No tasks available for this board.</p>
                  ) : (
                    <ul>
                      {tasks[board._id]?.map((task) => (
                        <li key={task._id} className="mb-4">
                          <BoardTask
                            title={task.title}
                            description={task.description}
                            dueDate={task.dueDate}
                            id={task?._id}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="flex justify-between items-center mt-auto">
                  <button
                    onClick={(e) => handleAddTask(e, board?._id)}
                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Task
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="w-full">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Add Task
                    </h3>
                    <div className="mb-4">
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        value={newTask.title}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        value={newTask.description}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                      ></textarea>
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="dueDate"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Due Date
                      </label>
                      <input
                        type="date"
                        name="dueDate"
                        id="dueDate"
                        value={newTask.dueDate}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleSubmitTask}
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Add Task
                </button>
                <button
                  onClick={handleModalClose}
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayBoard;
