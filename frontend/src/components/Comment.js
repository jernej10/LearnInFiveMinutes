import React from "react";

function Comment({ comment }) {
  console.log("!!!!!", comment);
  return (
    <div className="border-b-2 border-gray-200 w-1/2 mb-4">
      <div className="flex flex-row items-center">
        <img
          className="object-cover w-14 h-14 rounded-full inline-block mr-2"
          src={`http://localhost:8080/${
            comment.slikaProfilaPot !== ""
              ? comment.slikaProfilaPot
              : "slike/profile/unknown.png"
          }`}
          alt="Avatar"
        />
        <p className="text-purple-600 font-bold mr-4">
          {comment.imeKanala !== null ? comment.imeKanala : comment.email}
        </p>
        <p className="text-gray-400">{comment.datum}</p>
      </div>
      <p className="ml-16">{comment.vsebina}</p>
    </div>
  );
}

export default Comment;
