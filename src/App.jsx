import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React, { useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Home from './components/Home';
import { auth } from './components/firebase';
import ListTask from './components/ListTask';
function App() {
  const [user, setUser] = useState();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  },[]);
  return (
        <Routes>
              <Route path='/' exact element={user ? <Navigate to="/profile" /> : <SignIn />} />
              <Route path='/login' exact element={<SignIn />} />
              <Route path='/register' exact element={<SignUp />} />
      <Route path='/profile' exact element={<Home />} />
      <Route path='/listTask' exact element={<ListTask />} />
            </Routes>

  )
}

export default App
