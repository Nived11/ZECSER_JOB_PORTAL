import axios from "axios";
import ApiPath from "../../../shared/ApiPath";

const userBase = `${ApiPath}/user`;

export const fetchUserData = () =>
  axios.get(`${userBase}/home`, { withCredentials: true });
