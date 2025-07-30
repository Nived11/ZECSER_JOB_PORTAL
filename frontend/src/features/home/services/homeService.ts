import axios from "axios";
import ApiPath from "../../../shared/ApiPath";

export const fetchUserData = () =>axios.get(`${ApiPath}/home`, { withCredentials: true });
export const logoutUser = () => axios.post(`${ApiPath}/logout`, {}, { withCredentials: true });