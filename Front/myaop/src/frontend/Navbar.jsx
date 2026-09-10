import { Link, useNavigate } from "react-router-dom";
import { FiPlus, FiUser, FiLogOut, FiLogIn, FiUserPlus } from "react-icons/fi";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/"
          className="text-2xl font-bold text-blue-600 tracking-tight" >
          Blog
        </Link>

        <div className="flex items-center gap-2">
          {token ? (
            <>
              <Link to="/create"
                className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                <FiPlus size={16} />
                <span className="hidden sm:inline">Create</span>
              </Link>

              <Link to="/profile"
                className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition" >
                <FiUser size={16} />
                <span className="hidden sm:inline">Profile</span>
              </Link>

              <button onClick={handleLogout}
                className="flex items-center gap-1.5 text-red-500 hover:text-red-600 px-3 py-2 rounded-lg text-sm font-medium transition" >
                <FiLogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login"
                className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition" >
                <FiLogIn size={16} />
                <span className="hidden sm:inline">Login</span>
              </Link>

              <Link to="/register"
                className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                <FiUserPlus size={16} />
                <span className="hidden sm:inline">Register</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;