import { createBrowserRouter } from "react-router-dom";
import App from "./App";

import Home from "./screens/Home";
import Login from "./screens/Login";
import ForgetPassword from "./screens/ForgetPassword";
import ResetPassword from "./screens/ResetPassword";
import Register from "./screens/Register";
import RegisterSuccess from "./screens/RegisterSuccess";
import VerifySuccess from "./screens/VerifySuccess";
import Mypage from "./screens/Mypage";

import ProblemList from "./problem/ProblemList";
import ProblemDetail from "./problem/ProblemDetail";

import Board from "./screens/Board";
import Studygroup from "./screens/Studygroup";
import NotFound from "./screens/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "problem-list", element: <ProblemList /> },
      { path: "problem-detail/:problemId", element: <ProblemDetail /> },

      { path: "board", element: <Board /> },
      { path: "studygroup", element: <Studygroup /> },

      { path: "login", element: <Login /> },
      { path: "forget-password", element: <ForgetPassword /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "register", element: <Register /> },
      { path: "register-success", element: <RegisterSuccess /> },
      { path: "verify-success", element: <VerifySuccess /> },
      { path: "mypage/:username", element: <Mypage /> },
    ],
    errorElement: <NotFound />,
  },
]);

export default router;
