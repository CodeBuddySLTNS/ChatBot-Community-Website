import Axios from "axios";
import Config from "../../config.json";

const serverOrigin = Config.production ? Config.server : Config.devServer;
const token = localStorage.getItem("token");

const customAxios = Axios.create({
  baseURL: serverOrigin,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  }
});

export default customAxios;
