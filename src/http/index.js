import axios from "axios";

export const URL = "https://cloud-api.yandex.net/v1/disk/resources";

export const $api = axios.create({
    baseURL: URL
})

$api.interceptors.request.use((config) => {
    config.headers.Authorization = `OAuth ${localStorage.getItem('access_token')}`
    return config
})

$api.interceptors.response.use((config) => {
    return config;
}, async (error) => {
    const originalRequest = error.config
    const params = new URLSearchParams(error.config.url);
    if (error.response.data.error === "DiskNotFoundError" && !error.config._isRetry) {
        originalRequest._isRetry = true
        const path = params.get("path");
        try {
            await $api.put(`?path=${path}`);
            console.log(originalRequest)
            return $api.request(originalRequest)
        } catch (e) {
            console.log(e)
        }
    }
    if (error.response.data.error === "DiskResourceAlreadyExistsError") {
        const url = error.config.url
        const changedUrl = url.replace(/(\.\w+)$/, ' (copy)$1');
        try {
            return await $api.get(changedUrl)
        } catch (e) {
            console.log(e)
        }
    }
})