import userApi from "~/api/user";

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (process.client) {
        const scroll_position = useState("scrollbar");

        scroll_position.value?.scrollTo({
            top: 0,
        });
 
        const user = useState("current_user");

        if (!user.value) {
            try {
                const response = await userApi.me();

                if (!response?.success) {
                    throw createError({
                        statusCode: response.status,
                        message: response.message,
                    })
                }

                user.value = response.data;
            } catch (error) {
                if (!user.value && to.path !== '/login') {
                    return navigateTo('/login');           
                }
            }
        }
    }
});
