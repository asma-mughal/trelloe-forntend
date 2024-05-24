import React, { useEffect, useState } from "react";
import { API_URL } from "../constants";
import BoardTask from "./BoardTask";
import { FaTrash } from "react-icons/fa";
const DisplayBoard = ({ userId }) => {
  const [boards, setBoards] = useState([]);
  const [boardSuccessMessages, setBoardSuccessMessages] = useState({});
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState({})
  const [selectedBoardId, setSelectedBoardId] = useState();
  const [delayedTasks, setDelayedTasks] = useState({});
  useEffect(() => {
    fetchBoards();
  }, [userId, tasks]);

  useEffect(() => {
    fetchTasksForAllBoards();
  }, [tasks, boards]);
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
        return response.json();
      })
      .then((data) => {
        setIsModalOpen(false);
        setNewTask({
          title: "",
          description: "",
          dueDate: "",
        });
        setBoardSuccessMessages((prevMessages) => ({
          ...prevMessages,
          [selectedBoardId]: data.message,
        }));

        setTimeout(() => {
          setBoardSuccessMessages((prevMessages) => ({
            ...prevMessages,
            [selectedBoardId]: '',
          }));
        }, 3000);

      })
      .catch((error) => {
        console.error("Error saving task:", error);
      });
  };


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
        setLoading((prevLoading) => ({
          ...prevLoading,
          [boardId]: false,
        }));
        setTimeout(() => {
          setDelayedTasks((prevTasks) => ({
            ...prevTasks,
            [boardId]: data?.tasks,
          }));
        }, 2000); // Delay of 2 seconds
      })
      .catch((error) => {
        setLoading((prevLoading) => ({
          ...prevLoading,
          [boardId]: false,
        }));
        console.error("Error fetching tasks for board:", error);
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
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleDragStart = (event, index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event, newIndex) => {
    event.preventDefault();
    const draggedItem = boards[draggedIndex];
    const updatedBoards = [...boards];
    updatedBoards.splice(draggedIndex, 1);
    updatedBoards.splice(newIndex, 0, draggedItem);
    setBoards(updatedBoards);
    setDraggedIndex(null);
  };


  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Boards</h2>
      {boards?.length === 0 ? (
        <p>No boards available. Add a board to get started.</p>
      ) : (
        <div className="flex overflow-x-scroll bg-gray-100 pb-1 hide-scroll-bar"  onDragOver={handleDragOver} >
        <div className="flex bg-white flex-nowrap">
          {boards?.map((board, index) => (
            <div key={board?._id} className="inline-block px-3"
            draggable={true}
            onDragStart={(e) => handleDragStart(e, index)}
            onDrop={(e) => handleDrop(e, index)} >
             <div
               className="w-96 max-h-[800px] max-w-lg overflow-hidden rounded-lg shadow-md  hover:shadow-xl transition-shadow duration-300 ease-in-out"
                 >
              <div className="p-4 flex-grow flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg capitalize font-semibold">{board.name}</h3>
                  <button
                    onClick={() => handleDeleteBoard(board._id)}
                    className="text-red-600 hover:text-red-700 focus:outline-none"
                  >
                    <FaTrash />
                  </button>
                </div>
                <hr className="border-t-2 border-gray-200 my-2" />
                {boardSuccessMessages[board._id] && (
        <div className="p-4 mt-4 text-green-800 bg-green-200 rounded">
          {boardSuccessMessages[board._id]}
        </div>
      )}
                <div className="pb-4 flex-grow">
                  <h4 className="text-base font-bold mb-2">TASKS : </h4>
                  { loading[board._id] ? (
          <div className="flex justify-center items-center">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled
            >
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C6.48 0 2 4.48 2 10h2zm2 5.3a7.96 7.96 0 01-2-5.3H2c0 2.42 1 4.64 2.64 6.36l1.36-1.06z"
                ></path>
              </svg>
              Loading...
            </button>
          </div>
        ) :tasks[board._id]?.length === 0 ? (
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
              </div>
          ))}
              </div>
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
