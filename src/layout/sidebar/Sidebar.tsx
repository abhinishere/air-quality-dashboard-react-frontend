import { Link, useLocation } from "react-router-dom";
import { sidebarItems } from "../../lib/data";
import "./sidebar.scss";
import { LogOut } from "lucide-react";
import { useLogoutMutation } from "../../slices/users-api-slice";
import { logOut } from "../../slices/auth-slice";
import { useDispatch } from "react-redux";
import { toggleTheme } from "../../slices/theme-slice";
import { useSelector } from "react-redux";

export default function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const darkMode = useSelector((state: any) => state.theme.darkMode);
  const dispatch = useDispatch();
  const [logoutApiCall] = useLogoutMutation();

  async function logoutHandler() {
    try {
      if (darkMode) dispatch(toggleTheme());

      await logoutApiCall().unwrap();
      dispatch(logOut());
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className="sidebar">
      {sidebarItems.map((item) => (
        <div className="item" key={item.title}>
          <Link
            to={item.link}
            key={item.title}
            className={`${
              item.link === pathname ? "nav-active-link" : "nav-inactive-link"
            }`}
          >
            <div className="iconContainer">
              <item.icon className="icon sub-text" size={23} />
            </div>
            <div className="text">{item.title}</div>
          </Link>
        </div>
      ))}
      {/* log out */}
      <div className="item" key="Log out" onClick={logoutHandler}>
        <div className="nav-inactive-link">
          <div className="iconContainer">
            <LogOut className="icon sub-text" size={23} />
          </div>
          <div className="text">Log out</div>
        </div>
      </div>
    </div>
  );
}
