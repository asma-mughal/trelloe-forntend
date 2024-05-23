import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [error, setError] = useState(false);
    const [registerSuccess, setRegisterSuccess] = useState();
    const navigate = useNavigate()
    const handleRegister = async (e) => {
        e.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setError("Invalid email format");
          return;
        }
        if (password.length <= 6) {
          setError("Password should be more than 6 characters");
          return;
        }
    
        try {
          const signInMethods = await fetchSignInMethodsForEmail(auth, email);
          if (signInMethods.length > 0) {
            setError("Email already in use");
            return;
          }
          await createUserWithEmailAndPassword(auth, email, password);
          const user = auth.currentUser;
            if (user) {
              
            setRegisterSuccess(true)
            await setDoc(doc(db, "Users", user.uid), {
              email: user.email,
              firstName: fname,
              lastName: lname,
              photo: ""
            });
              
          }
          console.log("User Registered Successfully!!");
          navigate('/login'); // Use navigate function to redirect
        } catch (error) {
          console.log(error.message);
          setError(error.message);
        }
    };
    useEffect(() => {
        if (registerSuccess) {
         
        navigate("/login")   
        }
    },[registerSuccess])
    return (
        <form onSubmit={handleRegister} className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md flex flex-col justify-center h-screen">
      <h3 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Sign Up</h3>
  
      {error && (
        <div className="mb-4 text-red-600 text-center">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">First name</label>
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
          placeholder="First name"
          onChange={(e) => setFname(e.target.value)}
          required
        />
      </div>
  
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Last name</label>
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
          placeholder="Last name"
          onChange={(e) => setLname(e.target.value)}
        />
      </div>
  
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Email address</label>
        <input
          type="email"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
  
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Password</label>
        <input
          type="password"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
  
      <div className="mb-6">
        <button type="submit" className="w-full bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-600 transition duration-300">
          Sign Up
        </button>
      </div>
      <p className="text-right text-gray-600">
        Already registered? <a href="/login" className="text-indigo-500 hover:underline">Login</a>
      </p>
    </form>
      
  )
}

export default SignUp