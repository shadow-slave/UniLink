import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import CreatePost from "./pages/CreatePost";
import PostFeed from "./pages/PostFeed";
import "./styles/global.css";

function App() {
  return (
    <div className="main-container">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <h2>Welcome to UniLink 🎓</h2>
              </PrivateRoute>
            }
          />
          <Route
            path="/create"
            element={
              <PrivateRoute>
                <CreatePost />
              </PrivateRoute>
            }
          />
          <Route path="/feed" element={<PostFeed />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
