import send from "./index";
class ProjectApi {
    async create(data) {
        const res = await send("projects", {
            method: "post",
            body: data,
        });
        return res;
    }

    async getProjects() {
        const res = await send("projects");
        return res;
    }

    async getProject(id) {
        const res = await send("projects/" + id);
        return res;
    }

    async updateProject(fields, id, user_id = false) {
        try {
            if (!fields || !id) {
                return false;
            }
            const data = {
                name: fields.name,
                customer: fields.customer,
                description: fields.description,
                responsible_id: fields.responsible_id,
                deadline: fields.deadline,
            };
            if (user_id) {
                data.for_user = user_id;
            }
            const result = await send("projects/" + id, {
                method: "put",
                body: data,
            });
            return result?.data;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}

export default new ProjectApi();
