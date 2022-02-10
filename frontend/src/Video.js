import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import VideoCardHorizontal from "./VideoCardHorizontal";
import Searchbar from "./Searchbar";
import CommentForm from "./CommentForm";
import Comment from "./Comment";

function Video() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [video, setVideo] = useState({});
  const [videos, setVideos] = useState([]);
  const [comments, setComments] = useState([]);
  const [jeVseckal, setjeVseckal] = useState(false);

  // vrne komentarje videja
  const pridobiKomentarje = async () => {
    const requestOptions = {
      method: "GET",
      credentials: "include",
    };
    const response = await fetch(
      `http://localhost:8080/comments/${id}`,
      requestOptions
    );
    const comments = await response.json();
    setComments(comments);
    console.log(comments);
  };

  // pridobi če je všečkal video
  const pridobiJeVseckal = async () => {
    const requestOptions = {
      method: "GET",
      credentials: "include",
    };
    const response = await fetch(
      `http://localhost:8080/video/liked/${id}`,
      requestOptions
    );
    const data = await response.json();
    console.log("new", data);

    if (data.jeVseckal === "0") {
      setjeVseckal(false);
    } else {
      setjeVseckal(true);
    }
  };

  const handleLike = async () => {
    const requestOptions = {
      method: "GET",
      credentials: "include",
    };

    const response = await fetch(
      `http://localhost:8080/video/like/${jeVseckal}/${id}`,
      requestOptions
    );
    const data = await response.json();
    pridobiJeVseckal();
    pridobiVideo();
  };

  const pridobiVideo = async () => {
    const requestOptions = {
      method: "GET",
      credentials: "include",
    };
    // vrne video, ki ga želiš gledati
    const response = await fetch(
      `http://localhost:8080/video/${id}`,
      requestOptions
    );
    const video = await response.json();
    setVideo(video[0]);
    console.log(video[0]);
  };

  useEffect(async () => {
    const requestOptions = {
      method: "GET",
      credentials: "include",
    };

    try {
      // vrne video, ki ga želiš gledati
      const response = await fetch(
        `http://localhost:8080/video/${id}`,
        requestOptions
      );
      const video = await response.json();
      setVideo(video[0]);
      console.log(video[0]);
      // vrne priporočene videje po zvrsti brez videja, ki ga gledaš
      const response2 = await fetch(
        `http://localhost:8080/videos/recommended/${video[0].imeZvrsti}/${id}`,
        requestOptions
      );
      const videos = await response2.json();
      setVideos(videos);

      pridobiKomentarje();
      pridobiJeVseckal();

      // vnese ogled
      const response3 = await fetch(
        `http://localhost:8080/video/viewed/${id}`,
        requestOptions
      );
      const data = await response3.json();
    } catch (err) {
      console.log("ERROR", err);
      navigate("/login");
    }
  }, [id]);

  console.log(video);

  return (
    <div className="ml-20">
      <div className="h-24 p-7 bg-purple-600 from-indigo-700 to-purple-600 fixed top-0 left-20 right-0 z-40 border-purple-800 border-b-4">
        <Searchbar></Searchbar>
      </div>
      <div className="flex flex-col 2xl:flex-row pt-32 ">
        <div className="mx-6" style={{ width: "1200px" }}>
          <video width="1200" height="1040" controls key={video.pot}>
            <source
              src={`http://localhost:8080/videji/${video.pot}`}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
          <div className="py-4 mb-2">
            <div className="flex justify-between items-center">
              <p className="font-bold text-xl mb-2 ">{video.naslov}</p>
              <button class="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded inline-block">
                Subscribe
              </button>
            </div>
            <hr className="my-2" />
            <img
              className="object-cover w-14 h-14 rounded-full inline-block"
              src={`http://localhost:8080/${video.slikaProfilaPot}`}
              alt="Avatar"
            />
            <p className="inline-block ml-6 bg-purple-100 rounded p-2 text-black">
              {video.imeKanala}
            </p>
            <p className="text-gray-800 text-base my-3">
              {"~ " + video.opisVideja}
            </p>
            <div className="flex justify-between items-center">
              <p className="text-gray-700 text-base">
                {video.steviloOgledov} views | {video.datum} |{" "}
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 inline-block text-red-500"
                viewBox="0 0 20 20"
                fill={jeVseckal ? "red" : "lightgrey"}
                onClick={handleLike}
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <hr className="my-2" />
          <p className="font-bold text-lg">Comments</p>
          <CommentForm
            idVideo={id}
            getComments={pridobiKomentarje}
          ></CommentForm>
          {comments.length === 0
            ? "No comments yet!"
            : comments.map((comment) => (
                <Comment key={comment.vsebina} comment={comment}></Comment>
              ))}
        </div>
        <div className="mx-4">
          <h1 className="mb-2 text-lg">You may also like:</h1>
          <div className="flex flex-col">
            {videos.map((video, index) => (
              <Link key={index} to={`/video/${video.idVideo}`}>
                <VideoCardHorizontal
                  key={video.idVideo}
                  video={video}
                ></VideoCardHorizontal>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Video;
