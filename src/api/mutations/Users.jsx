import axios from 'axios';
import { baseURL } from '../../utils/config';
// import { getDataFromStorage } from '../../utils/functions';

export const addUser = async (values) => {
//   const config = {
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${getDataFromStorage('AuthToken')}`
//     }
//   };
  if (values) {
    const { data } = await axios.post(`${baseURL}/user`, values);
    return data;
  }
  throw new Error('No data to send');
};
export const updateUser = async (values) => {
  if (values) {
    const { data } = await axios.put(`${baseURL}/user`, values);
    return data;
  }
  throw new Error('No data to send');
};

export const deleteUsers = async (values) => {
  // console.log("Selected Users to be Send :",values);
  if (values) {
    const { data } = await axios.delete(`${baseURL}/users`, {params: values});
    return data;
  }
  throw new Error('No data to send');
};