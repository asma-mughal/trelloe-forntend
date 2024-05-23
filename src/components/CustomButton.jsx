import React from 'react'

const CustomButton = ({ onClick, buttonText }) => {
    return (
        <button
            onClick={onClick}
            className="px-4 py-2  bg-indigo-600 text-white text-sm font-medium rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
            {buttonText}
        </button>
  )
}

export default CustomButton