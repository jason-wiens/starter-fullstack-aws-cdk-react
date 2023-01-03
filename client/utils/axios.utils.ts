import axios from "axios";

const client = axios.create({
  baseURL: process.env.REACT_APP_API_ENDPOINT || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthHeader = (token: string) => {
  client.defaults.headers.common["Authorization"] = token;
};

export const removeAuthHeader = () => {
  delete client.defaults.headers.common["Authorization"];
};

export default client;
