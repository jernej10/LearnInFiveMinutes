import React, { useState } from "react";
import { Link } from "react-router-dom";

function Searchbar() {
  const [iskanVideo, setIskanVideo] = useState("");

  return (
    <>
      <input
        className="rounded rounded-tr-none rounded-br-none border-gray-400 appearance-none w-full md:w-1/3  w-1/3 py-3 px-4 text-gray-700 leading-tight focus:outline-none bg-white focus:border-gray-300 border-b-4"
        id="inline-full-name"
        type="text"
        placeholder="Video name..."
        onChange={(e) => setIskanVideo(e.target.value)}
      />
      <Link to={`/videos/search/${iskanVideo}`}>
        <button
          className="w-full md:w-auto text-sm bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-3 px-6 border-b-4 border-yellow-700 hover:border-yellow-500 rounded inline-block font-semibold uppercase lg:w-auto rounded-tl-none rounded-bl-none"
          type="button"
        >
          SEARCH
        </button>
      </Link>
    </>
  );
}

export default Searchbar;
