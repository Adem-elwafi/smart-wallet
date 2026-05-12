import axiosInstance from '../api/axiosConfig';

export const getMyWallet = async () => {
  const response = await axiosInstance.get('/v1/wallet/me');
  return response.data;
};