import axios from "axios";

export const follow = async (reqBody) => {
  return axios.put(
    `${process.env.REACT_APP_API}/feed/follow`,
    reqBody
  );
};

export const unfollow = async (reqBody) => {
  return axios.put(
    `${process.env.REACT_APP_API}/feed/unfollow`,
    reqBody
  );
};

export const getFollow = async (userId) => {
  return axios.get(`${process.env.REACT_APP_API}/feed/getFollow`, {
    params: { userId },
  });
};
