import React, { useState } from "react";

function UploadVideoForm({ pridobiVidejeUporabnika }) {
  const [naslov, setnaslov] = useState("");
  const [opis, setopis] = useState("");
  const [zvrst, setzvrst] = useState("Programming");
  const [thumbnailImage, setThumbnailImage] = useState("");
  const [video, setVideo] = useState("");
  const [infoTxt, setinfoTxt] = useState("");

  const objaviVidejo = async () => {
    setinfoTxt("Uploading... Please wait...");
    // Create an object of formData
    const formData = new FormData();

    // Update the formData object
    formData.append("video", video);
    formData.append("image", thumbnailImage);
    formData.append("naslov", naslov);
    formData.append("opis", opis);
    formData.append("zvrst", zvrst);

    const requestOptions = {
      method: "POST",
      credentials: "include",
      body: formData,
    };
    // console.log("SLIKA", formData);
    const response = await fetch(
      "http://localhost:8080/uploadVideo",
      requestOptions
    );

    setinfoTxt("");
    setnaslov("");
    setopis("");
    setThumbnailImage("");
    setVideo("");
    pridobiVidejeUporabnika();
  };

  return (
    <div className="w-full md:w-1/2 flex flex-col justify-evenly h-96">
      <input
        type="text"
        required
        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
        placeholder="Title"
        onChange={(e) => setnaslov(e.target.value)}
      />
      <textarea
        type="text"
        required
        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
        placeholder="Video description"
        onChange={(e) => setopis(e.target.value)}
      />
      <label>Choose video: </label>
      <input
        type="file"
        name="video"
        id="file"
        accept=".mp4"
        onChange={(e) => setVideo(e.target.files[0])}
      />
      <label>Choose thumbnail image: </label>
      <input
        type="file"
        name="image"
        id="file"
        accept=".png, .jpg"
        onChange={(e) => setThumbnailImage(e.target.files[0])}
      />
      <select
        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
        onChange={(e) => setzvrst(e.target.value)}
      >
        <option>Programming</option>
        <option>School</option>
        <option>Sport</option>
      </select>
      <small>{infoTxt}</small>
      <button
        className="bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 border-b-4 border-yellow-700 hover:border-yellow-500 rounded inline-block"
        onClick={objaviVidejo}
      >
        Upload
      </button>
    </div>
  );
}

export default UploadVideoForm;
