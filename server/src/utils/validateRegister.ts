import { UsernamePasswordInput } from "./UsernamePasswordInput";

export const validateRegister = (options: UsernamePasswordInput) => {
  if (!options.email.includes("@")) {
    return [
        {
          field: "email",
          message: "invalid email",
        },
      ];
  }

  if (options.username.length <= 2) {
    return [
        {
          field: "username",
          message: "lenght must be greater than 2",
        },
      ];
  }

  if (options.username.includes("@")) {
    return [
        {
          field: "username",
          message: "cannot include an @",
        },
      ];
  }

  if (options.password.length <= 3) {
    return [
        {
          field: "password",
          message: "lenght must be greater than 2",
        },
      ];
  }
  return null;
};
