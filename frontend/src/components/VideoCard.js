import React, { useState, useEffect } from "react";
import "./video.css";

const VideoCard = ({ video }) => {
  return (
    <div className="max-w-sm h-96 rounded overflow-hidden shadow-lg relative cursor-pointer card">
      <img
        className="w-full object-cover h-1/2"
        src={`http://localhost:8080/${video.slikaPot}`}
        alt="thumbnail image"
      />
      <div className="px-6 py-4 mb-2">
        <p className="font-bold text-xl mb-2">{video.naslov}</p>
        <img
          className="object-cover w-14 h-14 rounded-full inline-block"
          src={`http://localhost:8080/${video.slikaProfilaPot}`}
          alt="Avatar"
        />
        <p className="text-gray-900 text-base inline-block ml-6">
          {video.imeKanala}
        </p>
        <p className="text-gray-700 text-base">
          {video.steviloOgledov} views |{" "}
          {video.steviloVseckov === null ? 0 : video.steviloVseckov}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 inline-block text-red-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
        </p>
      </div>
      <div className="absolute bottom-0 right-0 bg-purple-600 text-white w-32 text-center p-2 text-sm font-semibold rounded">
        {video.imeZvrsti.toUpperCase()}
      </div>
    </div>
  );
};

export default VideoCard;
