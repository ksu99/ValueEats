import axios from "axios";

export const getEateryByCuisine = async (filter) => {
  return axios.get(`${process.env.REACT_APP_API}/browse/cuisine`, {
    params: { filter },
  });
};

export const getEateryByTime = async (fromDate, endDate) => {
  return axios.get(`${process.env.REACT_APP_API}/browse/time`, {
    params: { fromDate, endDate },
  });
};
