import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "./firebase";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (password.length < 6) {
        setError('Password should be at least 6 characters long');
        return;
      }
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in Successfully");
      setSuccessMessage('User logged in successfully');
      setTimeout(() => {
        window.location.href = "/profile";
      }, 2000);
    } catch (error) {
      console.log(error.message);
      setError(error.message);
    }
  };
  return (
    <>
      <h3 className="text-2xl font-semibold mt-6 text-black text-center">Welcome to Trello App</h3>
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md flex flex-col justify-center h-screen">
    <h3 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Login</h3>
    {error && (
        <div className="mb-4 text-red-600 text-center">
          {error}
        </div>
        )}
         {successMessage && (
        <div className="p-4 mt-4 mb-4 text-green-800 bg-green-200 rounded">
          {successMessage}
        </div>
      )}
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-2">Email address</label>
      <input
        type="email"
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>
  
    <div className="mb-6">
      <label className="block text-gray-700 font-medium mb-2">Password</label>
      <input
        type="password"
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>
    <div className="mb-6">
      <button type="submit" className="w-full bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-600 transition duration-300">
        Submit
      </button>
      </div>
      
    <p className="text-right text-gray-600">
      New user?<a href="/register" className="text-indigo-500 hover:underline"> Register Here</a>
    </p>
      </form>
      </>
  
  
  )
}

export default SignIn