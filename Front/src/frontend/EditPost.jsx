import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchPost = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/posts/${id}`
        );
        setTitle(res.data.title);
        setContent(res.data.content);
        setPreview(
          res.data.image
            ? `http://localhost:5000${res.data.image}`
            : ""
        );
      } catch (err) {
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, token, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

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

    await axios.put(
      `http://localhost:5000/api/posts/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    navigate(`/post/${id}`);
  } catch (err) {
    setError(err.response?.data?.message || "Failed to update post");
  }
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Edit Post
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
              className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Content</label>
            <textarea rows="10"
              className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={content} onChange={(e) => setContent(e.target.value)} required > 
            </textarea>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">
              Image 
            </label>
            <input type="file" 
              className="w-full border border-gray-300 p-3 rounded"
              onChange={handleImageChange} />
          </div>

          {preview && (
            <div className="mb-6">
              <img src={preview}alt="Preview"
                className=" w-full h-full object-cover  rounded"/>
            </div>
          )}

          <div className="flex gap-4">
            <button type="submit" 
              className="flex-1 bg-blue-600 text-white py-3 rounded hover:bg-blue-700" >
              Update Post
            </button>
            <button  type="button" onClick={() => navigate(`/post/${id}`)}
              className="flex-1 bg-gray-300 text-gray-800 py-3 rounded hover:bg-gray-400">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPost;