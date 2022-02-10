import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import VideoCard from "./VideoCard";
import Searchbar from "./Searchbar";

function SearchedVideos() {
  const [videos, setVideos] = useState([]);

  const { iskanNiz } = useParams();
  console.log("iskani", iskanNiz);
  useEffect(async () => {
    const response = await fetch(
      `http://localhost:8080/video/search/${iskanNiz}`
    );
    const videos = await response.json();
    setVideos(videos);
    console.log(videos);
  }, [iskanNiz]);

  return (
    <div className="md:ml-20">
      <div className="bg-purple-600 w-100 p-7 border-purple-800 border-b-4">
        <Searchbar></Searchbar>
      </div>
      <div className="ml-32 my-10 mr-4 grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-4">
        {videos.length === 0
          ? "No results found!"
          : videos.map((video) => (
              <Link to={`/video/${video.idVideo}`}>
                <VideoCard key={video.idVideo} video={video}></VideoCard>
              </Link>
            ))}
      </div>
    </div>
  );
}

export default SearchedVideos;
