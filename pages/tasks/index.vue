<template>
    <n-h1>Задачи</n-h1>
    <n-button
        @click="open_create_form = true"
        style="margin-bottom: 20px"
        v-if="user?.role_id == 1 || user?.role_id == 4"
    >
        Создать задачу
    </n-button>
    <tasks-list :tasks="task_array" />
    <n-drawer
        v-model:show="open_create_form"
        width="90%"
        style="max-width: 500px"
    >
        <n-drawer-content
            closable
            title="Создание нового задачи"
            :native-scrollbar="false"
        >
            <!-- @newTask="addTasks" -->
            <tasks-create-form @openDrawer="open_create_form = false" />
        </n-drawer-content>
    </n-drawer>
</template>

<script setup>
import { NH1, NButton, NDrawer, NDrawerContent } from "naive-ui";
import TasksApi from "~/api/tasks.js";

const user = useState("current_user");

const { data, error } = await TasksApi.getTasks();

const task_array = ref([]);
task_array.value = data;

const open_create_form = ref(false);

// function addTasks(task) {
//     task_array.value.push(task);
// }

let socket;

onMounted(() => {
    if (process.client) {
        // socket = new WebSocket("ws://" + window.location.host + "/ws/");
        socket = new WebSocket("ws://localhost:3000/ws/tasks");

        socket.addEventListener("message", (event) => {
            const event_data = JSON.parse(event.data);

            if (event_data?.action == "create") {
                task_array.value.push(event_data.task);
            }

            if (event_data?.action == "update") {
                const current_task = task_array.value.findIndex(
                    (task) => task.id == event_data.task.id
                );
                task_array.value[current_task] = Object.assign(
                    task_array.value[current_task],
                    event_data.task
                );
            }
        });
    }
});
</script>
