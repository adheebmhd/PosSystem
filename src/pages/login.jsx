import React from 'react'
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";


const login = () => {
  const navigate = useNavigate();
  const usernameRef = useRef(null); // 👈 Reference for input focus

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "adheeb" && password === "0772675123") {
      navigate("/meanu");
      
    }
    else if (username === "admin" && password === "1234") {
      navigate("/user");
      
    } 
    else {
      setError("❌ Username or Password Incorrect");
      setUsername("");
      setPassword("");

      // ✅ Focus back to username box
      usernameRef.current.focus();

      // ✅ Hide error after 2 seconds
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  };

  return (
      <div className="h-screen flex justify-center items-center bg-gray-200"
    style={{ backgroundImage: `url('/src/assets/1.jpeg')` }}>

      <div className="bg-white p-8 rounded-xl shadow-lg w-80">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleLogin}>
          <input
            ref={usernameRef} // 👈 attach the ref
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
          />

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>

    
  )
}

export default login

