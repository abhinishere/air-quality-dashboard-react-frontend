import { ChangeEventHandler, FocusEvent, useState } from "react";
import "./form-input.scss";

interface FormInputProps {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  required: boolean;
  errorMessage: string;
  pattern?: string;
}

export default function FormInput({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  required,
  errorMessage,
  pattern,
}: FormInputProps) {
  const [error, setError] = useState(false);

  function handleBlur(e: FocusEvent<HTMLInputElement>) {
    if (!e.target.checkValidity()) {
      console.log("pattern mismatch");
      setError(true);
    } else {
      setError(false);
    }
  }

  return (
    <div className="form-input">
      {label}
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        pattern={pattern}
        onBlur={handleBlur}
      />
      {error === true ? (
        <span className="warning-text">{errorMessage}</span>
      ) : (
        <></>
      )}
    </div>
  );
}
