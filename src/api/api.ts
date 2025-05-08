import axios from "axios";
import { CONFIG_TYPES, ENV, GET_REQ_TYPES, POST_REQ_TYPES } from "../util/constants";

export const getCities = async () => {
    try {
        const res = await axios.get(`${ENV.API_ENDPOINT}?key=${ENV.API_KEY}&reqType=${GET_REQ_TYPES.CONFIG_KEYS}&type=${CONFIG_TYPES.CITY}`)
        return res?.data?.data;
    } catch (error) {
        console.error(error)
        throw error;
    }
}

export const login = async (city: string, password: string) => {
    try {
        const res = await axios.post(
            `${ENV.API_ENDPOINT}?key=${ENV.API_KEY}&type=${POST_REQ_TYPES.AUTH}`,
            JSON.stringify({ city, password }),
            {
                headers: {
                    "Content-Type": "text/plain;charset=utf-8",
                },
                maxRedirects: 5,
            }
        );

        if (!res?.data?.success) {
            throw new Error("Invalid credentials");
        }

        return res?.data?.data;
    } catch (error) {
        console.error("Request failed:", error);
        throw error;
    }
};