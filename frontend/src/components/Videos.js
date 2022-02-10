import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import VideoCard from "./VideoCard";
import Searchbar from "./Searchbar";

function Videos() {
  const { zvrst } = useParams();

  const [videos, setVideos] = useState([]);

  useEffect(async () => {
    const response = await fetch(`http://localhost:8080/videos/${zvrst}`);
    const videos = await response.json();
    setVideos(videos);
    console.log(videos);
  }, [zvrst]);

  return (
    <div className="md:ml-20">
      <div className="h-24 p-7 bg-purple-600 from-indigo-700 to-purple-600 fixed top-0 left-20 right-0 z-40 border-purple-800 border-b-4">
        <Searchbar></Searchbar>
      </div>
      <div className="pt-32 ml-32 mb-10 mr-4 grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-4">
        {videos.map((video, index) => (
          <Link key={index} to={`/video/${video.idVideo}`}>
            <VideoCard key={video.idVideo} video={video}></VideoCard>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Videos;
