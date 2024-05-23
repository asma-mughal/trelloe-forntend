import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
const Home = () => {
    const [userDetails, setUserDetails] = useState(null);
  const fetchUserData = async () => {
    auth.onAuthStateChanged(async (user) => {
        const docRef = doc(db, "Users", user.uid);
      
        const docSnap = await getDoc(docRef);
        console.log(docSnap)
      if (docSnap.exists()) {
        setUserDetails(docSnap.data());
        console.log(docSnap.data());
      } else {
        console.log("User is not logged in");
      }
    });
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  async function handleLogout() {
    try {
      await auth.signOut();
      window.location.href = "/login";
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  }
    console.log(userDetails)
  return (
    <div>
    {userDetails ? (
      <>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            src={userDetails.photo}
            width={"40%"}
            style={{ borderRadius: "50%" }}
          />
        </div>
        <h3>Welcome {userDetails.firstName} 🙏🙏</h3>
        <div>
          <p>Email: {userDetails.email}</p>
                      <p>First Name: {userDetails.firstName}</p>
                      
        <button className="btn btn-primary" onClick={handleLogout}>
        Logout
                      </button>
        </div>
      </>
          ) : (
                  
                  <>
                  <p>Loading...</p>
                  
                      </>
    )}
  </div>
  )
}

export default Home