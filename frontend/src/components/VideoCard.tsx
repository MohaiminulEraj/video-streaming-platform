import React from "react";
import { Play } from "lucide-react";
import { Video } from "../types";
import { useAuthStore } from "../store/authStore";
import { Link } from "react-router-dom";

interface VideoCardProps {
  video: Video;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-48 object-cover"
        />
        {!isAuthenticated && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Link
              to="/login"
              className="bg-white text-gray-800 px-4 py-2 rounded-md flex items-center"
            >
              <Play className="w-4 h-4 mr-2" />
              Login to Watch
            </Link>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{video.title}</h3>
        <p className="text-gray-600 mt-2 line-clamp-2">{video.description}</p>
      </div>
    </div>
  );
};
