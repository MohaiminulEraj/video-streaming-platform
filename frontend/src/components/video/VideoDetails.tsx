import React from "react";
import { Video } from "../../types";
import { formatDate } from "../../utils/dateUtils";

interface VideoDetailsProps {
  video: Video;
}

export const VideoDetails: React.FC<VideoDetailsProps> = ({ video }) => {
  return (
    <div className="mt-6">
      <h1 className="text-2xl font-bold text-gray-900">{video.title}</h1>
      <div className="mt-2 text-sm text-gray-500">
        Uploaded {formatDate(video.createdAt)}
      </div>
      <p className="mt-4 text-gray-700">{video.description}</p>
    </div>
  );
};
