<template>
    <n-h1>Проекты</n-h1>
    <n-button @click="open_create_form = true" style="margin-bottom: 20px">
        Создать новый
    </n-button>
    <projects-list :projects="projects" />
    <n-drawer
        v-model:show="open_create_form"
        width="90%"
        style="max-width: 500px"
    >
        <n-drawer-content
            closable
            title="Создание нового проекта"
            :native-scrollbar="false"
        >
            <projects-create-form />
        </n-drawer-content>
    </n-drawer>
</template>

<script setup>
import { NH1, NButton, NDrawer, NDrawerContent } from "naive-ui";
import projectApi from "~/api/project.js";

const projects = ref([]);
const open_create_form = ref(false);

const { data, error } = await projectApi.getProjects();
if (data) projects.value = data;

let socket;

onMounted(() => {
    if (process.client) {
        // socket = new WebSocket("ws://" + window.location.host + "/ws/");
        socket = new WebSocket("ws://localhost:3000/ws/projects");

        socket.addEventListener("message", (event) => {
            const data = JSON.parse(event.data);
            console.log(data);

            // if (data?.action == "create") {
            //     task_array.value.unshift(data.task);
            // }
        });
    }
});
</script>
