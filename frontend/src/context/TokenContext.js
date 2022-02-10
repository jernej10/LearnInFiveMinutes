import React, { createContext, useState, useEffect } from "react";

export const TokenContext = createContext();

export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  useEffect(() => {
    console.log(document.cookie);
    if (document.cookie.indexOf("token=") !== -1) {
      setToken(
        document.cookie.substring(
          document.cookie.indexOf("token=") + 6,
          document.cookie.indexOf(" ") !== -1
            ? document.cookie.indexOf(" ")
            : document.cookie.length
        )
      );
    }
  }, [token]);
  return (
    <TokenContext.Provider value={{ token, setToken }}>
      {children}
    </TokenContext.Provider>
  );
};
