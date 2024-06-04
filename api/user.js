import send from "./index";
class UserApi {
    async login(login, password) {
        const res = await send("users/login", {
            method: "post",
            body: {
                login,
                password,
            },
        });

        if (res?.success) {
            sessionStorage.setItem("token", res?.data?.tokens?.access_token);
        }

        return res;
    }

    async me() {
        const res = await send("users/me");
        return res;
    }

    async updateUser(data) {
        const res = await send("users/me", {
            method: "put",
            body: data,
        });
        return res;
    }

    async logout() {
        await send("users/logout", { method: "post" });
    }
}

export default new UserApi();
