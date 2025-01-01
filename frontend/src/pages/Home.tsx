import React from "react";
import { VideoCard } from "../components/VideoCard";
import { Video } from "../types";

// Temporary mock data - replace with API call later
const mockVideos: Video[] = [
  {
    id: "1",
    title: "Introduction to React",
    description: "Learn the basics of React in this comprehensive tutorial",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
    videoUrl: "",
    userId: "1",
    createdAt: new Date().toISOString(),
  },
  // Add more mock videos as needed
];

export const Home: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Latest Videos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
};
