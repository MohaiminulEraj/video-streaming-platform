import React, { useEffect } from "react";
import { Player } from "video-react";
import "video-react/dist/video-react.css";
import ReactPlayer from "react-player";

interface VideoPreviewProps {
	file: File | null;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({ file }) => {
	if (!file) return null;
	console.log({ file });
	const videoUrl = URL.createObjectURL(file);
	console.log({ videoUrl });
	useEffect(() => {
		return () => {
			URL.revokeObjectURL(videoUrl);
		};
	}, [videoUrl]);

	return (
		<div className="mt-4">
			<h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
			<p className="text-sm font-medium text-gray-700 mb-2">
				File Name: {file?.name}
			</p>
			<p className="text-sm font-medium text-gray-700 mb-2">
				File Size: {(file?.size / 1024 / 1024)?.toFixed(2)} MB
			</p>
			{/* <ReactPlayer url={videoUrl} controls width="100%" height="100%" /> */}
			<Player
				playsInline
				src={videoUrl}
				fluid={false}
				width={640}
				height={356}
			/>
		</div>
	);
};
