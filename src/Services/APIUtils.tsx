import axios, { AxiosError } from "axios";
import request from "axios";
import { redirectPage } from "../Utils/Errors";

export default class APIUtils {
    static async login(email?: string, password?: string) {
        await axios.get('/sanctum/csrf-cookie');
        return await axios.post('/login', {
            email: email,
            password: password
        });
    };

    static async fetch(method: string, urlPath: string, data?: any) {
        let response = null;

        try {
            switch (method) {
                case 'GET':
                    response = await axios.get(urlPath, {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                    break;
                case 'POST': {
                    response = await axios.post(urlPath, data);
                    break;
                }
            }
        } catch (err) {
            if (request.isAxiosError(err) && err.response) {
                if (err.response.status === 401 || err.response.status === 419) {
                    return redirectPage('/auth/login');
                }
            }
        }

        // if (!response) {
        //     return redirectPage('/auth/login');
        // }

        return response;
    }
}