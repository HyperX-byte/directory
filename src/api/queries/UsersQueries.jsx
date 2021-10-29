import axios from "axios";
import { baseURL } from "../../utils/config";

export const fetchUsers = async () => {  
    const { data } = await axios.get(`${baseURL}/users`);
    return data;
}