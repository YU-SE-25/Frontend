import { createBrowserRouter } from "react-router-dom";
import App from "./App";

import Home from "./screens/Home";
import Login from "./screens/Login";
import Register from "./screens/Register";
import RegisterCheck from "./screens/RegisterCheck";
import Mypage from "./screens/Mypage";
import Problems from "./screens/Problem";
import Board from "./screens/Board";
import Studygroup from "./screens/Studygroup";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "problems", element: <Problems /> },
      { path: "board", element: <Board /> },
      { path: "studygroup", element: <Studygroup /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "register-check", element: <RegisterCheck /> },
      { path: "mypage", element: <Mypage /> },
    ],
  },
]);

export default router;
