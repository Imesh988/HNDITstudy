import axios from "axios";
import type { Comm } from "../type/Comm";
import type { Video } from "../type/Video";

const httpRequest = axios.create({
    baseURL: "http://localhost:3000/api",
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 10000
});

// Request interceptor for debugging
httpRequest.interceptors.request.use(
    (config) => {
        console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error("Request error:", error);
        return Promise.reject(error);
    }
);

// Response interceptor for debugging
httpRequest.interceptors.response.use(
    (response) => {
        console.log(`📥 ${response.status} ${response.config.url}`);
        return response;
    },
    (error) => {
        console.error("Response error:", error.response?.status, error.message);
        return Promise.reject(error);
    }
);

export const CommAPI = {
    create: (comm: Comm) => httpRequest.post("/comment/create", comm),
    getAll: () => httpRequest.get("/comment/all"),
    update: (id: string, comm: Comm) => httpRequest.put(`/comment/update/${id}`, comm),
    delete: (id: string) => httpRequest.delete(`/comment/delete/${id}`)
};

export const VideoAPI = {
    create: (video: Video) => httpRequest.post("/video/create", video),
    getAll: () => httpRequest.get("/video/all"),
    update: (id: string, video: Video) => httpRequest.put(`/video/update/${id}`, video),
    delete: (id: string) => httpRequest.delete(`/video/delete/${id}`)
};

export default httpRequest;