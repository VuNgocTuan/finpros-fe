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
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        try {
            switch (method) {
                case 'GET':
                    response = await axios.get(urlPath, config);
                    break;
                case 'POST': {
                    response = await axios.post(urlPath, JSON.stringify(data), config);
                    break;
                }
                case 'PUT': {
                    response = await axios.put(urlPath, JSON.stringify(data), config);
                    break;
                }
                case 'DELETE': {
                    response = await axios.delete(urlPath, config);
                    break;
                }
            }
        } catch (err) {
            if (request.isAxiosError(err) && err.response) {
                if (err.response.status === 401 || err.response.status === 419) {
                    return redirectPage('/auth/login');
                }

                throw err;
            }
        }

        return response;
    }

    static async upload(urlPath: string, files?: File[]) {
        let response = null;
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        };

        let formData = new FormData();
        files?.forEach((file) => {
            formData.append('files[]', file);
        })

        try {
            response = await axios.post(urlPath, formData, config);
        } catch (err) {
            if (request.isAxiosError(err) && err.response) {
                if (err.response.status === 401 || err.response.status === 419) {
                    return redirectPage('/auth/login');
                }

                throw err;
            }
        }

        return response;
    }
}