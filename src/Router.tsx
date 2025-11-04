import { createBrowserRouter } from "react-router-dom";
import App from "./App";

import Home from "./screens/Home";
import Login from "./screens/Login";
import OAuthCallback from "./screens/OAuthCallback";
import ForgetPassword from "./screens/ForgetPassword";
import ResetPassword from "./screens/ResetPassword";
import Register from "./screens/Register";
import RegisterSuccess from "./screens/RegisterSuccess";
import VerifySuccess from "./screens/VerifySuccess";
import Mypage from "./screens/Mypage";

import ProblemList from "./screens/problem/ProblemList";
import ProblemDetail from "./screens/problem/ProblemDetail";
import ProblemAdd from "./screens/problem/ProblemAdd";

import Board from "./screens/Board";

import StudyGroupMain from "./screens/studygroup/StudyGroupMain";
import StudyGroupDetail from "./screens/studygroup/StudyGroupDetail";

import NotFound from "./screens/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "problem-list", element: <ProblemList /> },
      { path: "problem-detail/:problemId", element: <ProblemDetail /> },
      { path: "problem-add", element: <ProblemAdd /> },

      { path: "board", element: <Board /> },

      { path: "studygroup-main", element: <StudyGroupMain /> },
      { path: "studygroup/:groupId", element: <StudyGroupDetail /> },

      { path: "login", element: <Login /> },
      { path: "oauth/callback", element: <OAuthCallback /> },
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
