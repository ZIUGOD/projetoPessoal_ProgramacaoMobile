import axios from "axios";

const api = axios.create({
    baseURL:
        "https://pro-api.coinmarketcap.com",
    headers: {
        "X-CMC_PRO_API_KEY": "9fec7050-acfb-445d-b2c7-b3653f2e322e",
    },
});

export default api;
