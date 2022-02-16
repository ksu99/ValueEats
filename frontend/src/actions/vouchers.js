import axios from "axios";

export const getVouchers = async (eateryId) => {
  return axios.get(`${process.env.REACT_APP_API}/voucher/get-voucher-event`, {
    params: { eateryId },
  });
};

export const deleteVoucher = async (voucherId) => {
  return axios.delete(`${process.env.REACT_APP_API}/voucher/delete-voucher-event`, {
    params: { voucherId },
  });
};

export const updateVouchers = async (reqBody) => {
  return axios.put(
    `${process.env.REACT_APP_API}/voucher/update-voucher-event`,
    reqBody
  );
};

export const createVouchers = async (reqBody) => {
  return axios.post(
    `${process.env.REACT_APP_API}/voucher/create-voucher-event`,
    reqBody
  );
};


export const getBookedVouchers = async (userId) => {
  return axios.get(`${process.env.REACT_APP_API}/profile/voucher`, {
    params: { userId: userId },
  });
};

export const getAvaliableVouchers = async (userId) => {
  return axios.get(`${process.env.REACT_APP_API}/voucher/display`, {
    params: { eateryId: userId },
  });
};

export const bookVoucher = async (reqBody) => {
  return axios.post(
    `${process.env.REACT_APP_API}/voucher/code/create`,
    reqBody
  );
};


export const redeemVoucher = async (reqBody) => {
  return axios.put(
    `${process.env.REACT_APP_API}/voucher/code/redeem`,
    reqBody
  );
};
