import React, { useState, useEffect } from "react";
import "./hero.css";
import Statistic from "./statistic";
import VideoCard from "./VideoCard";
import Searchbar from "./Searchbar";
import { Link } from "react-router-dom";

function Home() {
  const [videos, setVideos] = useState([]);
  const [statistic, setStatistic] = useState([]);

  useEffect(async () => {
    const response = await fetch("http://localhost:8080/videos");
    const videos = await response.json();
    setVideos(videos);
    console.log(videos);

    const response2 = await fetch("http://localhost:8080/statistics");
    const statistic = await response2.json();
    setStatistic(statistic);
    console.log(statistic);
  }, []);

  return (
    <>
      <div className="h-96 ml-20 p-4 bg-gradient-to-tl from-indigo-700 to-purple-600 border-purple-300 border-b-4">
        <div className="md:ml-24 sm:ml-6">
          <h1 className="text-white mt-20 text-4xl mb-6">
            Check out our educational videos!
          </h1>
          <Searchbar></Searchbar>
        </div>
      </div>
      <p className="ml-32  font-bold text-2xl my-4">Most recent videos: </p>
      <div className="ml-32 my-10 mr-4 h-auto grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 gap-4">
        {videos.map((video, index) => (
          <Link key={index} to={`/video/${video.idVideo}`}>
            <VideoCard key={video.idVideo} video={video}></VideoCard>
          </Link>
        ))}
      </div>
      <Statistic statistika={statistic} />

      <div className="ml-24 bg-white dark:bg-gray-800 ">
        <div className="text-center w-full mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 z-20">
          <h2 className="text-3xl font-extrabold text-black dark:text-white sm:text-4xl">
            <span className="block">Want to be a content creator?</span>
            <span className="block text-purple-600">
              It&#x27;s today or never.
            </span>
          </h2>
          <p className="text-xl mt-4 max-w-md mx-auto text-gray-400">
            Start making educational videos today and help other people to learn
            new things. Click the button below.
          </p>
          <div className="lg:mt-0 lg:flex-shrink-0">
            <Link to={"/registration"}>
              <button
                className="mt-6 w-full m-1 p-2 text-sm bg-purple-500 hover:bg-purple-400 text-white font-bold py-2 px-4 border-b-4 border-purple-700 hover:border-purple-500 rounded inline-block font-semibold uppercase lg:w-auto"
                type="button"
              >
                Get started
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
