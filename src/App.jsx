import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Home from './components/Home';
import { auth } from './components/firebase';
function App() {
  const [user, setUser] = useState();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  });
  return (
    <>
            <Routes>
              <Route
                path="/"
                element={user ? <Navigate to="/profile" /> : <SignUp />}
              />
              <Route path="/login" element={<SignIn />} />
                <Route path="/register" element={<SignUp />} />
                
              <Route path="/profile" element={<Home />} />
            </Routes>
        
    </>
  )
}

export default App
