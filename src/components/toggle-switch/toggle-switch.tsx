import "./toggle-switch.scss";

interface IToggleSwitch {
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  darkMode: boolean;
}

export default function ToggleSwitch({ onChange, darkMode }: IToggleSwitch) {
  return (
    <label className={`toggle-switch ${darkMode ? "active-dark-mode" : ""}`}>
      <input type="checkbox" onChange={onChange} />
      <div>
        <span />
      </div>
    </label>
  );
}
