// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CreatePost from "./pages/CreatePost";
import PostFeed from "./pages/PostFeed";
import Dashboard from "./pages/Dashboard"; // Import the new Dashboard component
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Navbar /> {/* Navbar stays at the top of all routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/feed" element={<PostFeed />} />
        {/* Protected routes */}
        <Route
          path="/create"
          element={
            <PrivateRoute>
              <CreatePost />
            </PrivateRoute>
          }
        />
        <Route
          path="/home" /* This route now leads to the Dashboard component */
          element={
            <PrivateRoute>
              <Dashboard /> {/* Render the Dashboard component here */}
            </PrivateRoute>
          }
        />
        {/* Optional: Add a catch-all route for unmatched paths */}
        <Route path="*" element={<PostFeed />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
