export default async function send(endpoint, params = {}) {
    const config = useRuntimeConfig();

    const default_params = {
        baseURL: config.public.apiBaseUrl + '/api/',
        method: 'get',
        credentials: "same-origin",
    };

    params = Object.assign(default_params, params);

    const api = $fetch.create({ ...params });

    let res = await api(endpoint).catch((error) => error.data);

    if (res.status == 401) {
        await $fetch(config.public.apiBaseUrl + '/api/users/refresh', { 
            credentials: "same-origin",  method: 'post',
        });

        res = await api(endpoint).catch((error) => error.data);
    }

    return res;
}