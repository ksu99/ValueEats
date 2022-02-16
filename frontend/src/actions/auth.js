import axios from "axios";

export const register = async (userData) => {
  return axios.post(`${process.env.REACT_APP_API}/register`, userData);
};

export const login = async (userData) => {
  return axios.post(`${process.env.REACT_APP_API}/login`, userData);
};

export const logout = async (token, userId) => {
  return axios.get(`${process.env.REACT_APP_API}/logout`, {
    params: userId,
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
};
