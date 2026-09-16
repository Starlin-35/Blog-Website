import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login first");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) {
        formData.append("image", image);
      }

      await axios.post(
        "https://blog-website-t32p.vercel.app/api/posts",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create New Post
        </h2>

        {error && (
          <p className="bg-red-100 text-red-600 p-2 rounded mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Title</label>
            <input type="text"
              className="w-full border border-gray-300 p-3 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}  required />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Content</label>
            <textarea rows="10"
              className="w-full border border-gray-300 p-3 rounded"
              value={content}
              onChange={(e) => setContent(e.target.value)} required>
            </textarea>
          </div>

          <div className="mb-6">
            <label className="block mb-1 font-medium">
              Image (from computer)
            </label>
            <input type="file" accept="image/*"
              className="w-full border border-gray-300 p-3 rounded"  onChange={(e) => setImage(e.target.files[0])} />
          </div>

          <div className=" flex gap-1 ">
            <Link to="/">
              <button type="submit" 
                className=" w-73 bg-white border  py-3 rounded hover:bg-grey-100" >
                Cancel
              </button>
            </Link>
            <button type="submit"
              className=" w-100 bg-blue-600 text-white py-3 rounded hover:bg-blue-700" >
              Create Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;