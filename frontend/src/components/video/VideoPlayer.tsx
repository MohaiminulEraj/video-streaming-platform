import React from "react";

interface VideoPreviewProps {
  file: File | null;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({ file }) => {
  if (!file) return null;

  const videoUrl = URL.createObjectURL(file);

  React.useEffect(() => {
    return () => {
      URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
      <video
        className="w-full aspect-video rounded-lg bg-black"
        controls
        src={videoUrl}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};
