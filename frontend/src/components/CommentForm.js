import React, { useState } from "react";

function CommentForm({ idVideo, getComments }) {
  const [comment, setcomment] = useState("");

  const postComment = async () => {
    const requestOptions = {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vsebina: comment, idVideo }),
    };
    const response = await fetch(
      "http://localhost:8080/comments",
      requestOptions
    );
    const data = await response.json();
    console.log("ID vstavljene vrstice: " + data);

    if (data.length !== 0) {
      getComments();
    } else {
      alert("Failed!");
    }
  };

  return (
    <div class="my-4 max-w-lg">
      <form class="w-full max-w-xl bg-white rounded-lg px-4">
        <div class="flex flex-wrap -mx-3 mb-6">
          <h2 class="pt-3 pb-2 text-gray-800 text-lg">Add a new comment</h2>
          <div class="w-full md:w-full mb-2 mt-2">
            <textarea
              class="bg-gray-100 rounded border border-gray-400 leading-normal resize-none w-full h-20 py-2 px-3 font-medium placeholder-gray-400 focus:outline-none focus:bg-white"
              name="body"
              placeholder="Your comment..."
              onChange={(e) => setcomment(e.target.value)}
              required
            ></textarea>
          </div>
          <div class="w-full md:w-full flex items-start md:w-full px-3">
            <div class="flex items-start w-1/2 text-gray-700 px-2 mr-auto">
              <svg
                fill="none"
                class="w-5 h-5 text-gray-600 mr-1"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p class="text-xs md:text-sm pt-px">
                Don't use aggressive language...
              </p>
            </div>
            <div class="-mr-1">
              <input
                type="button"
                class="bg-white text-purple-700 font-medium py-1 px-4 border border-purple-400 hover:bg-purple-700 hover:text-white cursor-pointer rounded-lg tracking-wide mr-1 hover:bg-gray-100"
                value="Post Comment"
                onClick={postComment}
              ></input>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CommentForm;
