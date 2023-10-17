import { useNavigate } from "react-router-dom";
import FormInput from "../../components/form-input/form-input";
import "./auth.scss";
import { ChangeEvent, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../../slices/users-api-slice";
import { setCredentials } from "../../slices/auth-slice";
import toast from "react-hot-toast";

interface ILoginInputs {
  email: string;
  password: string;
}

export default function Login() {
  // const { updateUserId, userId } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state: any) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const [dataFromForm, setDataFromForm] = useState<ILoginInputs>({
    email: "",
    password: "",
  });

  const inputs = [
    {
      id: 1,
      label: "Email",
      name: "email",
      type: "text",
      placeholder: "name@example.com",
      errorMessage: "Use a valid email id",
      required: true,
    },
    {
      id: 2,
      label: "Password",
      name: "password",
      type: "password",
      placeholder: "",
      errorMessage: "Password cannot be empty",
      required: true,
    },
  ];

  async function loginUser(event: any) {
    event.preventDefault();

    try {
      const res = await login(dataFromForm).unwrap();
      dispatch(setCredentials({ res }));
      toast.success("Signed in!");
      // navigate("/");
    } catch (err: any) {
      console.log(err);
      toast.error(`❌ ${err.data.message}`);
    }
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDataFromForm({ ...dataFromForm, [e.target.name]: [e.target.value][0] });
  };

  return (
    <div className="auth-page">
      <div className="box thin-border">
        <h1>Login</h1>
        <p>Enter your email and password to get started.</p>
        <form onSubmit={loginUser}>
          {inputs.map((input) => (
            <FormInput
              key={input.id}
              {...input}
              value={dataFromForm[input.name as keyof ILoginInputs]}
              onChange={onChange}
              errorMessage={input.errorMessage}
            />
          ))}
          <button>Sign in</button>
        </form>
        <a href="/register">Create an account</a>
      </div>
    </div>
  );
}
