import "./settings.scss";
import PageHeading from "../../components/page-heading/page-heading";
import ToggleSwitch from "../../components/toggle-switch/toggle-switch";
import { useDispatch } from "react-redux";
import { toggleTheme } from "../../slices/theme-slice";
import { useSelector } from "react-redux";

export default function Settings() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: any) => state.theme.darkMode);
  function handleMode() {
    dispatch(toggleTheme());
  }

  return (
    <div className="new-page settings-page">
      <PageHeading
        heading="Settings"
        subHeading="Manage your profile settings and website appearance."
      />
      {/* comparison box starts */}
      <form className="settings-card card-box-shadow">
        <div className="options">
          <div className="option">
            <p className="option-text">Switch to dark mode</p>
            <div className="mode-slider">
              <ToggleSwitch darkMode={darkMode} onChange={handleMode} />
            </div>
          </div>
        </div>
      </form>
      {/* comparison box ends */}
    </div>
  );
}
