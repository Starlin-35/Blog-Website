import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";

function Profile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bookmarks, setBookmarks] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (savedUser) {
      setUser(savedUser);
      setName(savedUser.name || "");
      setEmail(savedUser.email || "");
    }

    const fetchUserPosts = async () => {
      try {
        const res = await axios.get("https://blog-website-t32p.vercel.app/api/posts");
        const myPosts = res.data.filter(
          (post) => post.author?._id === savedUser?.id
        );
        setPosts(myPosts);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [token, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.put(
        "https://blog-website-t32p.vercel.app/api/auth/profile",
        { name, email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
      setEditMode(false);
      setMessage("Profile updated successfully");
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed");
    }
  };

  const fetchBookmarks = async () => {
  try {
    const res = await axios.get(
      "https://blog-website-t32p.vercel.app/api/auth/bookmarks",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setBookmarks(res.data);
  } catch (err) {
    console.log(err);
  }
};
fetchBookmarks();


  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This cannot be undone."
      )
    ) {
      return;
    }

    try {
      await axios.delete("https://blog-website-t32p.vercel.app/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/register");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to delete account");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <p className="text-gray-500">Loading</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-10 px-4">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Your Account
          </h3>

          {message && (
            <p className="bg-blue-50 text-blue-600 text-sm p-3 rounded-lg mb-4">
              {message}
            </p>
          )}

          {editMode ? (
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Name</label>
                <input type="text"
                  className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={name} onChange={(e) => setName(e.target.value)} required/>
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-medium">Email</label>
                <input type="email"
                  className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email} onChange={(e) => setEmail(e.target.value)} required/>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit"
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700" >
                  Save Changes
                </button>
                <button type="button"
                  onClick={() => setEditMode(false)}
                  className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg text-sm hover:bg-gray-300" >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="space-y-3 mb-6">
                <p className="text-gray-600">
                  <span className="font-medium text-gray-800">Name:</span>{" "}
                  {user?.name}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium text-gray-800">Email:</span>{" "}
                  {user?.email}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium text-gray-800">Total Posts:</span>{" "}
                  {posts.length}
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setEditMode(true)}
                  className="bg-yellow-500 text-white px-5 py-2 rounded-lg text-sm hover:bg-yellow-600">
                  Edit Account
                </button>
                <button onClick={handleDeleteAccount}
                  className="bg-red-500 text-white px-5 py-2 rounded-lg text-sm hover:bg-red-600" >
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mt-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            Saved Posts
          </h3>

          {bookmarks.length === 0 ? (
            <p className="text-gray-400">No saved posts yet.</p>
          ) : (
            <div className="space-y-4">
              {bookmarks.map((post) => (
                <div
                  key={post._id}
                  className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition" >
                  <div className="flex gap-4">
                    {post.image && (
                      <img
                        src={`http://blog-website-t32p.vercel.app
${post.image}`}
                        alt={post.title}
                        className="w-20 h-20 object-cover rounded" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">
                        {post.title}
                      </h4>
                      <p className="text-gray-500 text-sm mb-2">
                        {post.content?.substring(0, 80)}...
                      </p>
                      <Link
                        to={`/post/${post._id}`}
                        className="text-blue-600 text-sm hover:underline" >
                        View Post {">"}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            My Posts
          </h3>

          {posts.length === 0 ? (
            <p className="text-gray-400">You have no posts yet.</p>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post._id}
                  className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition">
                  <h4 className="font-semibold text-gray-800 mb-1">
                    {post.title}
                  </h4>
                  <p className="text-gray-500 text-sm mb-2">
                    {post.content.substring(0, 100)}
                  </p>
                  <Link
                    to={`/post/${post._id}`}
                    className="text-blue-600 text-sm hover:underline">
                    View Post{" >"}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;