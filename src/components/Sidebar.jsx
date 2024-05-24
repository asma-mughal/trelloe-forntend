import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import CustomButton from './CustomButton';
import { auth } from "./firebase";
import { API_URL } from '../constants';
const Sidebar = () => {
    const [userDetails, setUserDetails] = useState()
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate()
  async function handleLogout() {
    try {
      await auth.signOut();
      window.location.href = "/login";
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }
    
    const CreateBoardModal = ({ isOpen, onClose, onCreateBoard }) => {
        const [boardName, setBoardName] = useState('');
    
        const handleSubmit = (event) => {
            event.preventDefault();
            const data = {
                userId: userDetails?.uid,
                name: boardName
            };
            fetch(`${API_URL}/boards/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
                .then(data => {
                setSuccessMessage('Board created successfully!');
                console.log('Board created successfully:', data);
           
            })
            .catch(error => {
                console.error('There was a problem creating the board:', error);
            });
            setBoardName('');
            onClose();
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        };
    
        return (
            <div className={`fixed z-10 inset-0 overflow-y-auto ${isOpen ? '' : 'hidden'}`}>
                
                <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
    
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
    
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                        <form onSubmit={handleSubmit}>
                            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="w-full">
                                        <div className="mb-4">
                                            
      <label className="block text-gray-700 font-medium mb-2">Board Name</label>
                                            <div className="mt-1">
                                                <input
                                                    type="text"
                                                    id="boardName"
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                                                    placeholder="Enter board name"
                                                    value={boardName}
                                                    onChange={(e) => setBoardName(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                                    Create
                                </button>
                                <button onClick={onClose} type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    };
    const BoardCreationButton = ({ onCreateBoard }) => {
        const [isOpen, setIsOpen] = useState(false);
    
        const handleOpenModal = () => {
            setIsOpen(true);
        };
    
        const handleCloseModal = () => {
            setIsOpen(false);
        };
    
        return (
            <>     <CustomButton onClick={handleOpenModal} buttonText="Create a Board" />
        <CreateBoardModal isOpen={isOpen} onClose={handleCloseModal} onCreateBoard={onCreateBoard} />
            </>
        );
    };
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
          setUserDetails(user);
        });
    }, []);
    const handleListTasks = () => {
        navigate("/listTask", { state: { userId: userDetails?.uid } });
    };
    return (
        <div className="p-4">
        {userDetails ? (
                        <div className="flex flex-col items-center space-y-4">
                             <div>
          {successMessage && (
              <div className="p-4 mt-4 text-green-800 bg-green-200 rounded">
                  {successMessage}
              </div>
          )}
      </div>
          <BoardCreationButton />
          <button
              onClick={handleLogout}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
              Logout
          </button>
          <button
              onClick={handleListTasks}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
              List Tasks
          </button>
      </div>
  ) : (
      <div className="flex flex-col items-center justify-center space-y-4">
          <button
              onClick={handleLogout}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
              Logout
          </button>
          <p>Loading...</p>
          <BoardCreationButton />
      </div>
  )}
        </div>
  )
}

export default Sidebar