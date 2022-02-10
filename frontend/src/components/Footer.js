import React, { useState } from "react";

function Footer() {
  const [email, setEmail] = useState("");

  const sendEmail = async () => {
    const requestOptions = {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    };

    const response = await fetch(
      `http://localhost:8080/sendemail`,
      requestOptions
    );
    const data = await response.json();
    console.log(data);
    if (data == "Email poslan") {
      setEmail("");
    }
  };

  return (
    <footer className="flex justify-center px-4 text-gray-100 bg-gray-800 mt-4">
      <div className="container py-6">
        <h1 className="text-center text-lg font-bold lg:text-2xl">
          Join 240+ other and never miss <br /> out on new videos, tutorials,
          and more.
        </h1>

        <div className="flex justify-center mt-6">
          <div className="bg-white rounded-lg">
            <div className="flex flex-wrap justify-between md:flex-row">
              <input
                type="email"
                className="m-1 p-2 appearance-none text-gray-700 text-sm focus:outline-none"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                className="w-full m-1 p-2 text-sm bg-purple-500 hover:bg-purple-400 text-white font-bold py-2 px-4 border-b-4 border-purple-700 hover:border-purple-500 rounded inline-block font-semibold uppercase lg:w-auto"
                type="button"
                onClick={sendEmail}
              >
                SEND
              </button>
            </div>
          </div>
        </div>

        <hr className="h-px mt-6 bg-gray-700 border-none" />

        <div className="flex flex-col items-center justify-between mt-6 md:flex-row">
          <div>
            <a href="#" className="text-xl font-bold ml-24">
              LearnInFiveMinutes
            </a>
          </div>
          <div className="flex mt-4 md:m-0">
            <div className="-mx-4">
              <a href="#" className="px-4 text-sm">
                About
              </a>
              <a href="#" className="px-4 text-sm">
                Blog
              </a>
              <a href="#" className="px-4 text-sm">
                News
              </a>
              <a href="#" className="px-4 text-sm">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
