import axios from "axios";
import { BASE_URL } from "./apiConnConfig";

export default axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // <<- THIS IS ESSENTIAL FOR COOKIES
  timeout: 5000
});
