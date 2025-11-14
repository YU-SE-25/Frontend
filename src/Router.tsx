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
import MypageLayout from "./screens/mypage/MypageLayout";

import ProblemList from "./screens/problem/ProblemList";
import ProblemDetail from "./screens/problem/ProblemDetail";
import ProblemAdd from "./screens/problem/ProblemAdd";
import ProblemSolve from "./screens/problem/ProblemSolve";

import Board from "./screens/Board";

import StudyGroupMain from "./screens/studygroup/StudyGroupMain";
import StudyGroupDetail from "./screens/studygroup/StudyGroupDetail";

import NotFound from "./screens/NotFound";
import MyPageScreen from "./screens/mypage/MypageScreen";
import EditPage from "./screens/mypage/EditPage";
import MyPageRedirect from "./screens/mypage/MypageRedirect";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "problem-list", element: <ProblemList /> },
      { path: "problem-detail/:problemId", element: <ProblemDetail /> },
      { path: "problem-add", element: <ProblemAdd /> },
      { path: "problems/:problemId/solve", element: <ProblemSolve /> },

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
      {
        path: "mypage",
        element: <MyPageRedirect />,
      },
      {
        path: "mypage/:username",
        element: <MypageLayout />,
        children: [{ index: true, element: <MyPageScreen /> }],
      },
    ],
    errorElement: <NotFound />,
  },
]);

export default router;
