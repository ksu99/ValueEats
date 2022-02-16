import axios from "axios";

export const updateProfile = async (token, data) => {
  return axios.put(`${process.env.REACT_APP_API}/profile/update`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const eateryReview = async (token, userId) => {
  return axios.get(`${process.env.REACT_APP_API}/profile/review`, {
    params: userId,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
