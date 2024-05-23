import React from 'react'
import { API_URL, formatDate } from '../constants'
import { FaTrash } from 'react-icons/fa';
const BoardTask = ({ title, description, dueDate ,id}) => {
  const deleteTask = async (e,taskId) => {
    console.log(taskId)
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Add any additional headers if required, like authorization token
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
  
      console.log('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error.message);
    }
  };
    return (
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-indigo-500">
        
        <div className="flex items-center justify-between">
       
        <h5 className="font-bold text-lg text-indigo-700">{title}</h5>
       
        <button
          className="text-red-600 hover:text-red-700 focus:outline-none"
          onClick={(e)=>deleteTask(e,id )}
          >
          <FaTrash />
        </button>
      </div>
                            <p className="text-gray-700 mt-2">
                              {description}
                            </p>
                            <p className="text-gray-500 mt-1 text-sm">
                              Due Date: {formatDate(dueDate)}
                            </p>
                          </div>
  )
}

export default BoardTask