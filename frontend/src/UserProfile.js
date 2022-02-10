import React, { useEffect, useState, useContext } from "react";
import Searchbar from "./Searchbar";
import UploadVideoForm from "./UploadVideoForm";
import { useNavigate } from "react-router-dom";
import { TokenContext } from "../context/TokenContext";

function UserProfile() {
  const navigate = useNavigate();

  const [uporabnik, setUporabnik] = useState({});
  const [makeChannelFormVisible, setMakeChannelFormVisible] = useState(false);
  const [videos, setVideos] = useState([]);
  const [channelName, setChannelName] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [drzava, setDrzava] = useState("");
  const [geslo, setGeslo] = useState("");
  const [drzave, setDrzave] = useState([]);
  const { setToken } = useContext(TokenContext);

  const pridobiVidejeUporabnika = async () => {
    const requestOptions = {
      method: "GET",
      credentials: "include",
    };

    const response = await fetch(
      `http://localhost:8080/user/videos`,
      requestOptions
    );
    const videos = await response.json();
    setVideos(videos);
  };

  const izbrisiVideo = async (idVideo) => {
    const requestOptions = {
      method: "GET",
      credentials: "include",
    };

    console.log("id", idVideo);
    const response = await fetch(
      `http://localhost:8080/user/video/delete/${idVideo}`,
      requestOptions
    );
    const odgovor = await response.json();
    console.log("ODGOVOR", odgovor);
    pridobiVidejeUporabnika();
  };

  const pridobiUserja = async () => {
    const requestOptions = {
      method: "GET",
      credentials: "include",
    };
    try {
      const response = await fetch(
        "http://localhost:8080/user",
        requestOptions
      );
      const uporabnik = await response.json();
      setUporabnik(uporabnik[0]);
      setDrzava(uporabnik[0].nazivDrzave);

      const response2 = await fetch("http://localhost:8080/users/countries");
      let drzave = await response2.json();
      setDrzave(drzave);
      setDrzava(drzave[0].nazivDrzave);
      pridobiVidejeUporabnika();
    } catch (err) {
      navigate("/login");
    }
  };

  useEffect(() => {
    pridobiUserja();
  }, []);

  const makeChannel = async () => {
    // Create an object of formData
    const formData = new FormData();

    // Update the formData object
    formData.append("file", profileImg);
    formData.append("channel", channelName);
    const requestOptions = {
      method: "POST",
      credentials: "include",
      body: formData,
    };
    console.log("SLIKA", formData);
    const response = await fetch(
      "http://localhost:8080/makeChannel",
      requestOptions
    );
    pridobiUserja();
  };

  const odjavaUporabnika = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setToken(null);
    navigate("/");
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    const requestOptions = {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ drzava, geslo }),
    };

    try {
      const response = await fetch(
        "http://localhost:8080/user/update",
        requestOptions
      );
      pridobiUserja();
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <div className="ml-20">
      <div className="bg-purple-600 w-100 p-7 border-purple-800 border-b-4">
        <Searchbar></Searchbar>
      </div>
      <section className="py-6 bg-coolGray-100 text-coolGray-900">
        <div className="grid max-w-6xl grid-cols-1 px-6 mx-auto lg:px-8 md:grid-cols-2 md:divide-x">
          <div className="py-6 md:py-0 md:px-6">
            <h1 className="text-4xl font-bold">My profile</h1>
            <p className="pt-2 pb-4"></p>
            <div className="space-y-4">
              <p className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5 mr-2 sm:mr-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span>{uporabnik.nazivDrzave}</span>
              </p>
              <p className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5 mr-2 sm:mr-6"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                </svg>
                <span>{uporabnik.email}</span>
              </p>
              <p className="flex items-center">
                <button
                  className="bg-red-500 hover:bg-red-400 text-white w-1/2 font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded inline-block"
                  onClick={odjavaUporabnika}
                >
                  Log Out
                </button>
              </p>
            </div>
          </div>
          <form
            novalidate=""
            className="flex flex-col py-6 space-y-6 md:py-0 md:px-6 ng-untouched ng-pristine ng-valid"
          >
            <h1 className="text-2xl font-bold">Update profile</h1>
            <select
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              onChange={(e) => setDrzava(e.target.value)}
            >
              {drzave.map((drzava) => (
                <option key={drzava.idDrzava}>{drzava.nazivDrzave}</option>
              ))}
            </select>
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
              onChange={(e) => setGeslo(e.target.value)}
            />
            <button
              className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-2 px-4 border-b-4 border-gray-700 hover:border-gray-500 rounded inline-block"
              onClick={updateProfile}
            >
              Update
            </button>
          </form>
        </div>
      </section>
      {uporabnik.imeKanala === null && (
        <section className="py-6 bg-coolGray-100 text-coolGray-900 bg-gray-100">
          <div className="container mx-auto flex flex-col items-center justify-center p-4 space-y-8 md:p-10 lg:space-y-0 lg:flex-row lg:justify-between">
            <h1 className="text-3xl font-semibold leading-tight text-center lg:text-left">
              Do you want to make videos?
            </h1>
            <button
              className="bg-purple-500 hover:bg-purple-400 text-white font-bold py-2 px-4 border-b-4 border-purple-700 hover:border-purple-500 rounded inline-block"
              onClick={() => setMakeChannelFormVisible(!makeChannelFormVisible)}
            >
              Make channel
            </button>
          </div>
        </section>
      )}

      {makeChannelFormVisible && (
        <div className="mx-4 my-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="channelName"
            required
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Channel name"
            onChange={(e) => setChannelName(e.target.value)}
          />
          <div>
            <label>Channel profile image: </label>
            <input
              type="file"
              accept=".png, .jpg"
              name="file"
              id="file"
              onChange={(e) => setProfileImg(e.target.files[0])}
            />
          </div>
          <button
            type="submit"
            className="w-full md:w-72 bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-2 border-b-4 border-red-700 hover:border-red-500 rounded inline-block"
            onClick={makeChannel}
          >
            MAKE CHANNEL
          </button>
        </div>
      )}

      {uporabnik.imeKanala != null && (
        <div className="mx-4 my-2">
          <img
            className="object-cover w-14 h-14 rounded-full inline-block"
            src={`http://localhost:8080/${uporabnik.slikaProfilaPot}`}
            alt="Avatar"
          />
          <h1 className="font-bold my-2 mx-2 text-purple-600 bg-purple-100 rounded p-2 inline-block">
            {uporabnik.imeKanala}
          </h1>
          <h1 className="font-bold my-2">Upload video:</h1>
          <UploadVideoForm
            pridobiVidejeUporabnika={pridobiVidejeUporabnika}
          ></UploadVideoForm>
          <h1 className="font-bold my-2">Your videos:</h1>
          {videos.length === 0 ? (
            "No videos yet!"
          ) : (
            <table className="w-full md:w-1/2">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-2 text-xs text-black-500">
                    Video title
                  </th>
                  <th className="px-6 py-2 text-xs text-black-500">Uploaded</th>
                  <th className="px-6 py-2 text-xs text-black-500">Delete</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {videos.map((video, index) => (
                  <tr className="whitespace-nowrap" key={index}>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 font-bold">
                        {video.naslov}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {video.datum}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="w-full bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-2 border-b-4 border-red-700 hover:border-red-500 rounded inline-block"
                        onClick={() => izbrisiVideo(video.idVideo)}
                      >
                        DELETE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default UserProfile;
