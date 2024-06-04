export default async function send(endpoint, params = {}) {
    const config = useRuntimeConfig();

    const default_params = {
        baseURL: config.public.apiBaseUrl + '/api/',
        method: 'get',
        credentials: "same-origin",
    };

    params = Object.assign(default_params, params);

    const api = $fetch.create({
        ...params,
        async onResponseError({ request, response, options }) {
            if (response.status == 401 && !options.retry) {
                options.retry = true;

                await $fetch(config.public.apiBaseUrl + '/api/users/refresh', { 
                    credentials: "same-origin",  method: 'post',
                });

                response = await api(request).catch((error) => error.data);
            }
        },
    });

    const res = await api(endpoint).catch((error) => error.data);
    return res;
}