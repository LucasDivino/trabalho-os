import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "../pages/auth/register";
import Login from "../pages/auth/login";
import Layout from "../layout/index";
import CadastrarAluno from "../pages/cadastrarLugar";
import MelhorRota from "../pages/melhorRota";
import AuthContext from "../context";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      {LayoutRoute({ path: "/", element: <CadastrarAluno /> })}
      {LayoutRoute({ path: "/map", element: <MelhorRota /> })}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  </BrowserRouter>
);

const LayoutRoute = ({ path, element }) => {
  const { auth } = useContext(AuthContext);
  return auth.authorized ? (
    <Route path={path} element={<Layout> {element}</Layout>} />
  ) : null;
};

export default AppRoutes;
