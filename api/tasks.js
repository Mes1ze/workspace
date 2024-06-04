import send from "./index";
class TasksApi {
    async create(data) {
        const res = await send("tasks", {
            method: "post",
            body: data,
        });
        return res;
    }

    async getTasks() {
        const res = await send("tasks?count=100");
        // const res = await send("tasks?count=100&completion_name=progress");
        return res;
    }

    async getTask(id) {
        const res = await send("tasks/" + id);
        // const res = await send("tasks?count=100&completion_name=progress");
        return res;
    }

    async updateTask(id, data) {
        const res = await send("tasks/" + id, {
            method: "put",
            body: data,
        });

        return res;
    }
}

export default new TasksApi();
