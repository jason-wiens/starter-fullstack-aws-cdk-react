type Status = "Not Started" | "In Progress" | "Completed" | "Error";

type ValidationError = {
  field: string;
  message: string;
};

type FormErrors<T> = {
  [key in keyof T | "general"]?: string;
};

type ReturnFormActionSuccess<U> = {
  status: "success";
  data: U;
  errors: undefined;
};

type ReturnFormActionError<T> = {
  status: "error";
  errors: FormErrors<T>;
  data: undefined;
};

type FormActionFn<T, U> = (
  formData: T
) => Promise<ReturnFormActionSuccess<U> | ReturnFormActionError<T>>;

type FormValidationFn<T> = (formData: T) => FormErrors<T> | null;
