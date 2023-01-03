import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { produce } from "immer";

import { useUsers, CreateUserFormFields } from "data/state";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuildingUser } from "@fortawesome/pro-light-svg-icons";

import { InputText, SubmitButton } from "components/forms";

import s from "./create-user.module.css";
import { AppRoutes } from "client/routes/app/routes.app";

const CreateUser = () => {
  const { isLoading, createUser } = useUsers();
  const [formData, setFormData] = useState<CreateUserFormFields>({
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
  });
  const [formErrors, setFormErrors] = useState<
    FormErrors<CreateUserFormFields>
  >({});
  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(
      produce((state) => {
        state[name as keyof CreateUserFormFields] = value;
      })
    );
    setFormErrors(
      produce((state) => {
        delete state[name as keyof CreateUserFormFields];
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { errors } = await createUser(formData);
    if (errors) {
      setFormErrors(errors);
      return;
    }

    navigate(AppRoutes.Users);
  };

  return (
    <div className={s.container}>
      <div className={s.titleCard}>
        <div className={s.logo}>
          <FontAwesomeIcon icon={faBuildingUser} className={s.logoIcon} />
        </div>
        <div>
          <h1 className={s.title}>Create New User</h1>
        </div>
      </div>
      <div className={s.contentCard}>
        {formErrors.general && (
          <div className={s.generalError}>{formErrors.general}</div>
        )}
        <form onSubmit={handleSubmit}>
          <InputText
            value={formData.firstName}
            onChange={onChange}
            error={formErrors.firstName}
            name="firstName"
            disabled={isLoading}
          >
            First Name
          </InputText>
          <InputText
            value={formData.lastName}
            onChange={onChange}
            error={formErrors.lastName}
            name="lastName"
            disabled={isLoading}
          >
            Last Name
          </InputText>
          <InputText
            value={formData.email}
            onChange={onChange}
            error={formErrors.email}
            name="email"
            disabled={isLoading}
          >
            Email
          </InputText>
          <InputText
            value={formData.confirmEmail}
            onChange={onChange}
            error={formErrors.confirmEmail}
            name="confirmEmail"
            disabled={isLoading}
          >
            Confirm Email
          </InputText>
          <div className="w-full mt-16">
            <SubmitButton busy={isLoading}>Create User</SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
