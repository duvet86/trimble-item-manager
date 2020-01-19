import { LoadingContainer } from "@mis/common";
import { getTokenAsync } from "lib/authApi";
import { storeToken } from "lib/sessionStorageApi";
import Login from "login/Login";
import React, {
  ChangeEvent,
  FC,
  FormEvent,
  MouseEvent,
  useEffect,
  useState
} from "react";
import { RouteComponentProps } from "react-router";

const handleMouseDownPassword = (e: MouseEvent) => {
  e.preventDefault();
};

const LoginContainer: FC<RouteComponentProps> = ({ history }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isInvalidCredentials, setIsInvalidCredentials] = useState(false);
  const [error, setError] = useState();
  const [sendRequest, setSendRequest] = useState(false);

  useEffect(() => {
    const submitForm = async () => {
      setIsLoading(true);
      try {
        const token = await getTokenAsync(username, password);
        storeToken(token);
        history.push("/");
      } catch (error) {
        setSendRequest(false);
        if (error.status === 401) {
          setIsLoading(false);
          setIsInvalidCredentials(true);
        } else {
          setError(error);
        }
      }
    };

    if (sendRequest) {
      submitForm();
    }
  }, [sendRequest, history, password, username]);

  const handleChange = (prop: "username" | "password") => (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    if (prop === "username") {
      setUsername(event.target.value);
    } else if (prop === "password") {
      setPassword(event.target.value);
    } else {
      throw new Error("Invalid input.");
    }
  };

  const handleClickShowPasssword = () => {
    setShowPassword(prevState => !prevState);
  };

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    setSendRequest(true);
  };

  return (
    <LoadingContainer isLoading={isLoading} error={error}>
      <Login
        username={username}
        password={password}
        showPassword={showPassword}
        isInvalidCredentials={isInvalidCredentials}
        submitHandler={submitHandler}
        handleChange={handleChange}
        handleMouseDownPassword={handleMouseDownPassword}
        handleClickShowPasssword={handleClickShowPasssword}
      />
    </LoadingContainer>
  );
};

export default LoginContainer;