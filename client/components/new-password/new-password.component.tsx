import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { InputText } from "components/forms";
import { Logo } from "components/logo";
import { SubmitButton } from "components/forms";

import { useAuth } from "data/state";
import { newPassword as newPasswordChallenge } from "data/actions/auth";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faKey,
  faCircleXmark,
  faCircleCheck,
} from "@fortawesome/pro-thin-svg-icons";

import s from "./new-password.module.css";

const NewPassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [oldPasswordError, setOldPasswordError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const { email, setAuthState } = useAuth();

  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [capitalLetterInPassword, setCapitalLetterInPassword] = useState(false);
  const [lowercaseLetterInPassword, setLowercaseLetterInPassword] =
    useState(false);
  const [numberInPassword, setNumberInPassword] = useState(false);
  const [specialCharacterInPassword, setSpecialCharacterInPassword] =
    useState(false);
  const [passwordLength, setPasswordLength] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let isErrors = false;

    if (oldPassword === "") {
      setOldPasswordError("Old password is required");
      isErrors = true;
    }
    if (newPassword === "") {
      setNewPasswordError("New password is required");
      isErrors = true;
    }
    if (!passwordsMatch) {
      setConfirmNewPasswordError("Passwords do not match");
      isErrors = true;
    }

    if (
      !capitalLetterInPassword ||
      !lowercaseLetterInPassword ||
      !numberInPassword ||
      !specialCharacterInPassword ||
      !passwordLength
    ) {
      setNewPasswordError("Password requirements not met.");
      isErrors = true;
    }

    if (!isErrors) {
      setBusy(true);
      const loginResults = await newPasswordChallenge(
        email!,
        oldPassword,
        newPassword,
        confirmNewPassword
      );
      const { success } = loginResults;

      if (success) {
        const { userSession } = loginResults;
        setAuthState(userSession!);
        navigate("/app/my-projects");
        return;
      } else {
        const { error } = loginResults;
        console.log(error);
        setLoginError("Unable to set new passord. Please try again.");
      }
    }

    setBusy(false);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewPassword(value);
    setNewPasswordError("");
    setLoginError("");

    if (value.length >= 8) {
      setPasswordLength(true);
    } else {
      setPasswordLength(false);
    }

    if (value.match(/[A-Z]/)) {
      setCapitalLetterInPassword(true);
    } else {
      setCapitalLetterInPassword(false);
    }

    if (value.match(/[a-z]/)) {
      setLowercaseLetterInPassword(true);
    } else {
      setLowercaseLetterInPassword(false);
    }

    if (value.match(/[0-9]/)) {
      setNumberInPassword(true);
    } else {
      setNumberInPassword(false);
    }

    if (value.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)) {
      setSpecialCharacterInPassword(true);
    } else {
      setSpecialCharacterInPassword(false);
    }
  };

  const handleConfirmNewPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    setConfirmNewPassword(value);
    setConfirmNewPasswordError("");
    setLoginError("");

    if (value === newPassword) {
      setPasswordsMatch(true);
    } else {
      setPasswordsMatch(false);
    }
  };

  const passwordRequirements = [
    {
      text: "The Password must be at least 8 characters long",
      check: passwordLength,
    },
    {
      text: "The Password must contain one or more uppercase characters",
      check: capitalLetterInPassword,
    },
    {
      text: "The Password must contain one or more lowercase characters",
      check: lowercaseLetterInPassword,
    },
    {
      text: "The Password must contain one or more numbers",
      check: numberInPassword,
    },
    {
      text: "The Password must contain one or more special characters",
      check: specialCharacterInPassword,
    },
  ];

  return (
    <div className={s.pageContainer}>
      <div className={s.logoContainer}>
        <Logo />
      </div>
      <div className={s.container}>
        <div className="mb-12">
          <h1 className="text-xl font-semibold">New Password Required</h1>
          <p className="text-gray-500 text-sm">Email: {email}</p>
          {!!loginError && <h3 className="text-red-500">{loginError}</h3>}
        </div>
        <form onSubmit={handleSubmit}>
          <InputText
            value={oldPassword}
            onChange={(e) => {
              setOldPassword(e.target.value);
              setOldPasswordError("");
              setLoginError("");
            }}
            error={oldPasswordError}
            name="oldPassword"
            type="password"
          >
            <FontAwesomeIcon icon={faKey} className="mr-2" />
            Old Password
          </InputText>
          <InputText
            value={newPassword}
            onChange={handleNewPasswordChange}
            error={newPasswordError}
            name="newPassword"
            type="password"
          >
            <FontAwesomeIcon icon={faKey} className="mr-2" />
            New Password
          </InputText>
          <InputText
            value={confirmNewPassword}
            onChange={handleConfirmNewPasswordChange}
            error={confirmNewPasswordError}
            name="confirmNewPassword"
            type="password"
          >
            <FontAwesomeIcon icon={faKey} className="mr-2" />
            Confirm New Password
            {passwordsMatch && (
              <FontAwesomeIcon
                icon={faCircleCheck}
                className="absolute text-green-500 bottom-2 right-0"
                size="lg"
              />
            )}
          </InputText>
          <ul className={s.requirementsContainer}>
            Password Requirements:
            {passwordRequirements.map((requirement, index) => (
              <li
                key={index}
                className={`${s.requirement} ${
                  requirement.check ? "text-green-500" : "text-gray-500"
                }`}
              >
                {requirement.check ? (
                  <FontAwesomeIcon icon={faCircleCheck} className="mr-2" />
                ) : (
                  <FontAwesomeIcon icon={faCircleXmark} className="mr-2" />
                )}
                {requirement.text}
              </li>
            ))}
          </ul>
          <div className="w-full mt-16">
            <SubmitButton busy={busy}>Change Password</SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewPassword;
