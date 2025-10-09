//import React from "react";
import { Routes, Route } from "react-router-dom";

//import styled from "styled-components";

import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Mypage from "./components/Mypage";
import Problems from "./components/Problem";
import Board from "./components/Board";
import Studygroup from "./components/Studygroup";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/problems" element={<Problems />} />
      <Route path="/board" element={<Board />} />
      <Route path="/studygroup" element={<Studygroup />} />

      {/* Topbar의 우측 인증/마이페이지 항목 */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Mypage 컴포넌트 연결 */}
      <Route path="/mypage" element={<Mypage />} />
    </Routes>
  );
}
