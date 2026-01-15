export const API = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },
};

export enum BodyType {
  JSON = "application/json",
  FORM_DATA = "multipart/form-data",
}
