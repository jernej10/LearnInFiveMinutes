import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Registration() {
  const [email, setEmail] = useState("");
  const [geslo, setGeslo] = useState("");
  const [letoRojstva, setletoRojstva] = useState(18);
  const [drzava, setDrzava] = useState("");

  const [drzave, setDrzave] = useState([]);

  const sendRegistration = async () => {
    let idDrzave;
    drzave.forEach((element) => {
      if (element.nazivDrzave === drzava) idDrzave = element.idDrzava;
    });

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, geslo, letoRojstva, idDrzave }),
    };
    const response = await fetch(
      "http://localhost:8080/registration",
      requestOptions
    );
    const data = await response.json();
    console.log("ID vstavljene vrstice: " + data);

    if (data.length != 0) {
      alert("Registration was successful!");
    } else {
      alert("Registration failed!");
    }
  };

  useEffect(async () => {
    const response = await fetch("http://localhost:8080/users/countries");
    let drzave = await response.json();
    setDrzave(drzave);
    setDrzava(drzave[0].nazivDrzave);
  }, []);

  return (
    <div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ml-20 mb-72">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            REGISTRATION
          </h2>
        </div>
        <form class="mt-8 space-y-6" action="#" method="POST">
          <input type="hidden" name="remember" value="true" />
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="email-address" class="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label for="password" class="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                onChange={(e) => setGeslo(e.target.value)}
              />
            </div>
            <div>
              <label for="age" class="sr-only">
                Age
              </label>
              <input
                name="age"
                type="number"
                min="18"
                max="10"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Your age"
                onChange={(e) =>
                  setletoRojstva(new Date().getFullYear() - e.target.value)
                }
              />
            </div>
            <select
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              onChange={(e) => setDrzava(e.target.value)}
            >
              {drzave.map((drzava) => (
                <option key={drzava.idDrzava}>{drzava.nazivDrzave}</option>
              ))}
            </select>
          </div>
          <Link to={"/login"}>
            <a
              href="#"
              class="font-medium text-purple-600 hover:text-purple-800"
            >
              Already have account?
            </a>
          </Link>

          <div>
            <button
              type="button"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={sendRegistration}
            >
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg
                  class="h-5 w-5 text-purple-500 group-hover:text-purple-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Registration;
