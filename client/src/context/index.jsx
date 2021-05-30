import React, { createContext, useEffect, useState } from "react";

const getInitialState = () => {
  const data = localStorage.getItem("tp-auth");

  return data
    ? JSON.parse(data)
    : { user: null, authorized: false, token: null };
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(getInitialState());

  useEffect(() => {
    localStorage.setItem("tp-auth", JSON.stringify(auth));
  }, [auth]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
