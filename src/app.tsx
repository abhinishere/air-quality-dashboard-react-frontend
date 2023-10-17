import "./styles/main.scss";
import Home from "./pages/home/home";
import Cities from "./pages/compare/compare";
import Readings from "./pages/readings/readings";
import Sidebar from "./layout/sidebar/Sidebar";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import Settings from "./pages/settings/settings";
import { useContext, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Provider, useSelector } from "react-redux";
import store from "./store";
import { useDispatch } from "react-redux";

function App() {
  // const darkMode = useSelector((state: any) => state.theme.darkMode);
  const darkMode = useSelector((state: any) => state.theme.darkMode);
  function RootLayout() {
    const navigate = useNavigate();
    const { userInfo } = useSelector((state: any) => state.auth);

    useEffect(() => {
      if (!userInfo) {
        navigate("/login");
      }
    }, [navigate, userInfo]);
    return (
      <div className="root-layout">
        <div className="sidebar-container">
          <Sidebar />
        </div>
        <div className="content-container">
          {/* content would be dynamic so using Outlet from react dom router */}
          <Outlet />
        </div>
      </div>
    );
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/compare",
          element: <Cities />,
        },
        {
          path: "/readings",
          element: <Readings />,
        },
        {
          path: "/settings",
          element: <Settings />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);
  return (
    <main className={`main ${darkMode ? "dark" : "light"}`}>
      <div className="background text flex">
        <Toaster />
        <RouterProvider router={router} />
      </div>
    </main>
  );
}

export default App;
