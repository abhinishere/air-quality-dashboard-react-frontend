import "../login/auth.scss";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "../../components/form-input/form-input";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { API_URL } from "../../lib/data";

interface IRegisterInputs {
  username: string;
  email: string;
  password: string;
}

export default function Register() {
  const navigate = useNavigate();
  const [dataFromForm, setDataFromForm] = useState<IRegisterInputs>({
    username: "",
    email: "",
    password: "",
  });

  const inputs = [
    {
      id: 1,
      label: "Username",
      name: "username",
      type: "text",
      placeholder: "",
      errorMessage: "Usernames are 4-16 chars and cannot have special chars.",
      required: true,
      pattern: "^[A-Za-z0-9]{4,15}$",
    },
    {
      id: 2,
      label: "Email",
      name: "email",
      type: "text",
      placeholder: "name@example.com",
      errorMessage: "Use a valid email id.",
      required: true,
    },
    {
      id: 3,
      label: "Password",
      name: "password",
      type: "password",
      placeholder: "",
      errorMessage: "Password should be at least 8-20 characters long.",
      required: true,
      pattern: "^.{8,20}$",
    },
  ];

  async function registerUser(event: any) {
    event.preventDefault();

    await fetch(`${API_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataFromForm),
    }).then((response) => {
      //account creation failed
      if (!response.ok) {
        toast.error("Registration failed.");
        return;
      }

      // successful
      setDataFromForm({
        username: "",
        email: "",
        password: "",
      });
      toast.success("Registered! Sign in now.");
      navigate("/");
    });
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDataFromForm({ ...dataFromForm, [e.target.name]: [e.target.value][0] });
  };

  const { userInfo } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  return (
    <div className="auth-page">
      <div className="box thin-border">
        <h1>Register</h1>
        <p>Let&apos;s create you an account!</p>
        <form onSubmit={registerUser} className="inputs">
          {inputs.map((input) => (
            <FormInput
              key={input.id}
              {...input}
              value={dataFromForm[input.name as keyof IRegisterInputs]}
              onChange={onChange}
              errorMessage={input.errorMessage}
            />
          ))}
          <button>Sign up</button>
        </form>
        <a href="/login">Sign in instead</a>
      </div>
    </div>
  );
}
