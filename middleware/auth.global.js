import userApi from "~/api/user";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const scroll_position = useState("scrollbar");
    scroll_position.value?.scrollTo({
        top: 0,
    });
    if (process.client) {
        const user = useState("current_user");

        if (!user.value) {
            const response = await userApi.me();

            if (response?.success) {
                user.value = response.data;

                //  if (to.path !== '/') {
                //      return navigateTo('/');
                //  }
            }
        }

        if (!user.value && to.path !== "/login") {
            return navigateTo("/login");
        }
    }
});
