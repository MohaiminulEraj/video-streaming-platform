import React from "react";

interface VideoPlayerComponentProps {
  videoUrl: string;
}

export const VideoPlayerComponent: React.FC<VideoPlayerComponentProps> = ({
  videoUrl,
}) => {
  return (
    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
      <video
        className="w-full h-full"
        controls
        controlsList="nodownload"
        playsInline
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};
