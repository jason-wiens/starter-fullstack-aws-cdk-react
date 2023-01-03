import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { InputText } from "components/forms";
import { Logo } from "components/logo";
import { SubmitButton } from "components/forms";

import { login } from "data/actions/auth";
import { useAuth } from "data/state/auth.state";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faKey } from "@fortawesome/pro-thin-svg-icons";

import s from "./login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const { setEmail: setAuthEmail, setAuthState } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email === "") {
      setEmailError("Email is required");
    }

    if (password === "") {
      setPasswordError("Password is required");
    }

    if (email !== "" && password !== "") {
      setBusy(true);
      const loginResults = await login(email, password);
      const { success } = loginResults;

      if (success) {
        const { userSession } = loginResults;
        setAuthState(userSession!);
        navigate("/app/my-projects");
        return;
      } else {
        const { newPasswordRequired, error, email } = loginResults;

        if (newPasswordRequired) {
          setAuthEmail(email!);
          navigate("/new-password");
          return;
        }

        if (error) {
          console.log(error);
          setLoginError("Invalid email or password");
          setBusy(false);
        }
      }
    }
  };

  return (
    <div className={s.pageContainer}>
      <div className={s.logoContainer}>
        <Logo />
      </div>
      <div className={s.container}>
        <div className="mb-12">
          <h1 className="text-xl font-semibold">Welcome Back!</h1>
          {!!loginError && <h3 className="text-red-500">{loginError}</h3>}
        </div>
        <form onSubmit={handleSubmit}>
          <InputText
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
              setLoginError("");
            }}
            error={emailError}
            name="email"
          >
            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
            Email
          </InputText>
          <InputText
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError("");
              setLoginError("");
            }}
            error={passwordError}
            name="password"
            type="password"
          >
            <FontAwesomeIcon icon={faKey} className="mr-2" />
            Password
          </InputText>
          <div className="w-full mt-16">
            <SubmitButton busy={busy}>Log In</SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
