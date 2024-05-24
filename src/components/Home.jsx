import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import DisplayBoard from "./DisplayBoard";
import Sidebar from "./Sidebar";
const Home = () => {
    const [userDetails, setUserDetails] = useState()
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
          setUserDetails(user);
        });
    }, []);
  return (
    <div className="flex flex-row h-screen">
   
    <div className="w-1/4 bg-indigo-500">
     <Sidebar />
    </div>
    <div className="w-3/4 bg-gray-100">
      <div className="p-4">
                  <DisplayBoard userId={ userDetails?.uid} />
      </div>
    </div>
  </div>
  )
}

export default Home