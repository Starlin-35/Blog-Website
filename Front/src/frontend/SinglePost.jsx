import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaHeart } from "react-icons/fa6";
import { CiHeart } from "react-icons/ci";
import { IoChevronBackSharp } from "react-icons/io5";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import Navbar from "./Navbar";


function SinglePost() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postRes = await axios.get(
          `https://blog-website-t32p.vercel.app/api/posts/${id}`
        );
        setPost(postRes.data);
        setLikesCount(postRes.data.likes?.length || 0);

        if (user && postRes.data.likes) {
          const liked = postRes.data.likes.some(
            (likeId) =>
              likeId === user.id ||
              likeId?._id === user.id ||
              likeId?.toString() === user.id
          );
          setIsLiked(liked);
        }

        const commentRes = await axios.get(
          `https://blog-website-t32p.vercel.app/api/comments/${id}`
        );
        setComments(commentRes.data);
      } catch (err) {
        setError("Post not found");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleLike = async () => {
    if (!token) {
      alert("Please login to like");
      return;
    }

    try {
      const res = await axios.put(
        `https://blog-website-t32p.vercel.app/api/posts/like/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLikesCount(res.data.likes);
      setIsLiked(res.data.liked);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to like");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(
        "https://blog-website-t32p.vercel.app/api/comments",
        { text: newComment, postId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments([res.data, ...comments]);
      setNewComment("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(
        `https://blog-website-t32p.vercel.app/api/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete comment");
    }
  };

const handleBookmark = async (postId) => {
  if (!token) {
    alert("Please login to save posts");
    return;
  }

  try {
    const res = await axios.put(
      "https://blog-website-t32p.vercel.app/api/auth/bookmark",
      { postId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    alert(res.data.message);
  } catch (err) {
    alert(err.response?.data?.message || "Failed to save");
  }
};

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(
        `https://blog-website-t32p.vercel.app/api/posts/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete post");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl">Loading</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-red-500">
          {error || "Post not found"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto py-10 px-4">
        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <Link to="/"><div className=" flex items-center text-blue-400"><IoChevronBackSharp/>Back</div></Link>
          <h1 className="text-3xl font-bold mb-4">
            {post.title}
          </h1>

          <div className="flex justify-between text-sm text-gray-500 mb-6">
            <span>By: {post.author?.name || "Unknown"}</span>
            <span>
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>

          {post.image && (
            <img
              src={`https://blog-website-t32p.vercel.app${post.image}`}
              alt={post.title}
              className="w-full h-full  object-cover rounded mb-6"/>
          )}

          <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-6">
            {post.content}
          </p>

          
        
        <div className=" flex justify-between items-center">
          {token && user && post.author?._id === user.id && (
            <div className="flex gap-4">
              <Link
                to={`/edit/${post._id}`}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600" >
                Edit
              </Link>
              <button
                onClick={handleDeletePost}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"  >
                Delete
              </button>
            </div>
          )}
        <div className=" flex items-center ">
          <button onClick={handleLike}
            className={`px-4 py-2 rounded mb-6 flex items-center mt-5 ${
              isLiked
                ? " text-red-500 "  : "  text-gray-800"
            }`}>
            {isLiked ? <FaHeart className=" text-red-500 h-7 w-10 " /> :  <CiHeart className=" h-7 w-8 " />}  
            <span className=" font-medium text-1xl">{likesCount}</span>
          </button>
          <button onClick={() => handleBookmark(post._id)} className="text-gray-500 hover:text-blue-600 transition" >
              <FaRegBookmark size={18} />
          </button>
        </div>
        </div>
      </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">
            Comments ({comments.length})
          </h2>

          {token ? (
            <form onSubmit={handleAddComment} className="mb-8">
              <textarea rows="3"
                className="w-full border border-gray-300 p-3 rounded mb-3"
                placeholder="Write a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)}
                required
              ></textarea>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700" >
                Add Comment
              </button>
            </form>
          ) : (
            <p className="mb-6 text-gray-500">
              Please{" "}
              <Link to="/login" className="text-blue-600">
                Login
              </Link>{" "}
              to comment.
            </p>
          )}

          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-gray-500">No comments yet.</p>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment._id}
                  className="border border-gray-200 p-4 rounded" >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">
                        {comment.user?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {token && user && comment.user?._id === user.id && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-red-500 text-sm hover:underline" >
                        Delete
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700">
                    {comment.text}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePost;