import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const App = () => {
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [comments, setComments] = useState({});
  const [showCommentSection, setShowCommentSection] = useState(null);
  const videoRefs = useRef([]);

  // Fetch videos from the backend
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("/api/videos");
        setVideos(response.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchVideos();
  }, []);

  // Handle video upload
  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("title", title);

    try {
      const response = await axios.post("/api/videos/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Video uploaded successfully");

      setVideos([response.data.video, ...videos]);
      setTitle("");
      setVideoFile(null);
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  // Handle video delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/videos/${id}`);
      setVideos(videos.filter((video) => video._id !== id));
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  // Handle like
  const handleLike = async (id) => {
    try {
      const updatedVideos = videos.map((video) => {
        if (video._id === id) {
          return { ...video, likes: (video.likes || 0) + 1 };
        }
        return video;
      });
      setVideos(updatedVideos);

      await axios.post(`/api/videos/${id}/like`);
    } catch (error) {
      console.error("Error liking video:", error);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (e, id) => {
    e.preventDefault();
    const commentText = comments[id] || "";

    if (commentText.trim() === "") return;

    try {
      const updatedVideos = videos.map((video) => {
        if (video._id === id) {
          return {
            ...video,
            comments: [...(video.comments || []), commentText],
          };
        }
        return video;
      });

      setVideos(updatedVideos);
      setComments({ ...comments, [id]: "" });

      await axios.post(`/api/videos/${id}/comment`, { comment: commentText });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Handle autoplay and pause when the video scrolls out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play();
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, [videos]);

  // Enable sound on user interaction
  const handleVideoClick = (index) => {
    const video = videoRefs.current[index];
    if (video) {
      video.muted = false;
      video.play();
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold my-4">Responsive Video App</h1>

      {/* Video Upload Form */}
      <form
        onSubmit={handleUpload}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg"
      >
        <input
          type="text"
          placeholder="Enter video title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-4 p-2 border rounded w-full"
          required
        />
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideoFile(e.target.files[0])}
          className="mb-4 p-2 border rounded w-full"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded w-full"
        >
          Upload Video
        </button>
      </form>

      {/* Video Feed */}
      <div className="flex flex-col items-center w-full">
        {videos.map((video, index) => (
          <div
            key={video._id}
            className="w-full md:w-3/4 mb-8 bg-white rounded-lg shadow-md overflow-hidden relative"
          >
            {/* Video Header */}
            <div className="flex justify-between items-center p-4">
              <h2 className="text-lg font-bold">{video.title}</h2>
              <button
                onClick={() => handleDelete(video._id)}
                className="bg-red-500 text-white text-sm font-bold py-1 px-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>

            {/* Video Player */}
            <div
              className="flex justify-center items-center bg-black"
              onClick={() => handleVideoClick(index)}
            >
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                className="max-w-full max-h-[80vh] rounded-lg"
                src={`http://localhost:5000/${video.videoPath}`}
                loop
                muted
              />
            </div>

            {/* Like and Comment Icons */}
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex flex-col space-y-4">
              <button
                onClick={() => handleLike(video._id)}
                className="bg-gray-200 p-3 rounded-full shadow hover:bg-gray-300"
              >
                ❤️ {video.likes || 0}
              </button>
              <button
                onClick={() =>
                  setShowCommentSection(
                    showCommentSection === video._id ? null : video._id
                  )
                }
                className="bg-gray-200 p-3 rounded-full shadow hover:bg-gray-300"
              >
                💬
              </button>
            </div>

            {/* Comment Section */}
            {showCommentSection === video._id && (
              <div className="absolute inset-0 bg-white z-10 p-4 overflow-auto">
                <button
                  onClick={() => setShowCommentSection(null)}
                  className="absolute top-4 right-4 bg-gray-200 p-2 rounded-full"
                >
                  🔙
                </button>
                <h3 className="text-lg font-bold mb-4">Comments</h3>
                <form
                  onSubmit={(e) => handleCommentSubmit(e, video._id)}
                  className="flex space-x-2 mb-4"
                >
                  <input
                    type="text"
                    value={comments[video._id] || ""}
                    onChange={(e) =>
                      setComments({ ...comments, [video._id]: e.target.value })
                    }
                    placeholder="Write a comment..."
                    className="flex-1 p-2 border rounded"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Post
                  </button>
                </form>
                <div>
                  {video.comments &&
                    video.comments.map((comment, index) => (
                      <p
                        key={index}
                        className="text-gray-700 bg-gray-200 p-2 rounded my-2"
                      >
                        {comment}
                      </p>
                    ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
