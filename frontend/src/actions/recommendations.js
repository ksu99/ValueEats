import axios from "axios";

export const getRecommendationsList = async (dinerId) => {
  return axios.get(
    `${process.env.REACT_APP_API}/recommendation/get-recommendation`,
    {
      params: { userId: dinerId },
    }
  );
};
