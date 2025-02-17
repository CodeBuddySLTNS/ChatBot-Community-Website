import Axios from "axios";
import Config from "../../config.json";

const serverOrigin = Config.production ? Config.server : Config.devServer;

const customAxios = Axios.create({ baseUrl: serverOrigin });

export default customAxios;
