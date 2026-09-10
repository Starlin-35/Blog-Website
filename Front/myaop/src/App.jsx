import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./frontend/Navbar";
import Home from "./frontend/Home";
import Login from "./frontend/Login";
import Register from "./frontend/Register";
import CreatePost from "./frontend/CreatePost";
import SinglePost from "./frontend/SinglePost";
import EditPost from "./frontend/EditPost";
import Profile from "./frontend/Profile";

function App() {
  const location = useLocation();
  const hideNavbar = ["/create"].includes(location.pathname);

  return (
    <div className=" bg-gray-50">
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/post/:id" element={<SinglePost />} />
        <Route path="/edit/:id" element={<EditPost />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;