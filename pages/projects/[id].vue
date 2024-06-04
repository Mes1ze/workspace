<template>
    <!-- <n-h1>Проект {{ route.params.id }}</n-h1> -->
    <n-space
        horizontal
        :size="60"
        :align="'flex-end'"
        style="margin-bottom: 40px"
    >
        <n-h1>{{ res?.data.name }}</n-h1>
        <n-space horizontal :size="20" :align="'center'">
            <n-button @click="open_edit_form = true"> Редактировать </n-button>
            <n-button> Архивировать </n-button>
        </n-space>
    </n-space>
    <!-- Плашка -->
    <n-space vertical :size="40">
        <n-descriptions
            label-placement="top"
            :column="4"
            style="width: 100%; max-width: 1200px"
            size="large"
        >
            <n-descriptions-item label="Заказчик">
                {{ res?.data.customer }}
            </n-descriptions-item>
            <n-descriptions-item label="Ответственный">
                {{ res?.data.responsible_id }}
            </n-descriptions-item>
            <!-- <n-descriptions-item label="Стадия">
        {{ res?.data.stage_id }}
      </n-descriptions-item> -->
            <n-descriptions-item label="Дедлайн">
                <template v-if="Number(res?.data.deadline)">
                    <span
                        :style="{
                            color: deadlineColor(Number(res?.data.deadline)),
                            transition: '.5s',
                        }"
                    >
                        <n-time
                            :time="new Date(res?.data.deadline * 1000)"
                            format="dd MMMM HH:mm"
                            type="relative"
                        />
                    </span>
                </template>
                <template v-else> - </template>
            </n-descriptions-item>
        </n-descriptions>

        <!-- Описание -->
        <n-collapse class="project_desc">
            <n-collapse-item title="Описание" name="1">
                <template v-if="res?.data.description">
                    <div v-html="res?.data.description"></div>
                </template>
            </n-collapse-item>
        </n-collapse>

        <!-- Steps -->
        <n-steps :current="current_stage">
            <n-step
                v-for="(step, index) in res?.data?.project_stages"
                :title="step.name"
                :status="getStatus(step)"
                @click="setStage(step, index)"
            >
                <n-time
                    :time="new Date(step.deadline * 1000)"
                    format="dd MMMM HH:mm"
                    type="relative"
                />
            </n-step>
        </n-steps>

        <!-- Канбан -->
        <projects-kanban />
    </n-space>

    <!-- Редактирование проекта -->
    <n-drawer
        v-model:show="open_edit_form"
        width="90%"
        style="max-width: 500px"
    >
        <n-drawer-content
            closable
            title="Редактирование проекта"
            :native-scrollbar="false"
        >
            <projects-edit-form @newData="getNewData" />
        </n-drawer-content>
    </n-drawer>

    <!-- Редактирование задачи -->
    <n-drawer v-model:show="open_edit_task" width="90%">
        <n-drawer-content
            closable
            title="Редактирование задачи"
            :native-scrollbar="false"
        >
            <kanban-edit-form @newData="getNewData" />
        </n-drawer-content>
    </n-drawer>
    {{ steps_status }}
</template>

<script setup>
import {
    NH1,
    NCollapse,
    NCollapseItem,
    NDescriptions,
    NDescriptionsItem,
    NSpace,
    NButton,
    NDrawer,
    NDrawerContent,
    NSteps,
    NStep,
    useDialog,
    NTime,
} from "naive-ui";
import projectsApi from "~/api/project.js";
import KanbanEditForm from "~/components/Projects/KanbanEditForm.vue";

const now = ref(new Date());
const end = new Date("2024-03-01 GMT+3");
const days_before_deadline = ref(new Date(now.value - 259200000));

if (process.client) {
    setInterval(() => {
        now.value = new Date();
    }, 1000);
}

const res = ref(null);
const route = useRoute();
res.value = await projectsApi.getProject(route.params.id);

const current_stage = ref(1);
current_stage.value = res.value?.data?.stages_id;

const open_edit_form = ref(false);
const open_edit_task = useState("edit_task");
open_edit_task.value = false;

const is_dark_theme = ref(false);
const local_theme = useCookie("dark_theme");

is_dark_theme.value = local_theme.value;

const dialog = useDialog();

function setStage(step, index) {
    dialog.warning({
        showIcon: false,
        title: "Подтверждение",
        content:
            "Вы уверены, что хотите изменить стадию " +
            `"${step.name}"` +
            " проекта?",
        negativeText: "Нет",
        positiveText: "Да",
        onPositiveClick: () => {
            sumbit(index);
        },
        positiveButtonProps: {
            type: "primary",
        },
    });
}

function sumbit(index) {
    current_stage.value = index + 1;
}

function getNewData(new_data) {
    res.value.data = new_data;
}

// function convertTimestamp(timestamp) {
//     var d = new Date(timestamp * 1000),
//         yyyy = d.getFullYear(),
//         mm = ("0" + (d.getMonth() + 1)).slice(-2),
//         dd = ("0" + d.getDate()).slice(-2),
//         hh = d.getHours(),
//         h = hh,
//         min = ("0" + d.getMinutes()).slice(-2),
//         ampm = "AM",
//         time;

//     if (hh > 12) {
//         h = hh - 12;
//         ampm = "PM";
//     } else if (hh === 12) {
//         h = 12;
//         ampm = "PM";
//     } else if (hh == 0) {
//         h = 12;
//     }

//     time = yyyy + "-" + mm + "-" + dd + ", " + h + ":" + min + " " + ampm;
//     return time;
// }
let socket;

onMounted(() => {
    if (process.client) {
        socket = new WebSocket(
            "ws://localhost:3000/ws/projects/" + route.params.id
        );

        socket.addEventListener("message", (event) => {
            const data = JSON.parse(event.data);
            console.log(data);

            // if (data?.action == "create") {
            //     task_array.value.unshift(data.task);
            // }
        });
    }
});

function getStatus(step) {
    if (step.id < res?.value?.data?.stage_id) {
        return "finish";
    } else if (step.id == res?.value?.data?.stage_id) {
        return "process";
    } else {
        return "wait";
    }
}

function deadlineColor(timestamp) {
    let date = new Date(timestamp * 1000);
    if (res?.value?.data?.is_archive != "1") {
        //3 дня до сдачи
        if (date < now.value && date > days_before_deadline.value) {
            if (dark_theme.value) {
                return "#f2c97d";
            } else {
                return "#f0a020";
            }
        }

        //Просрочен
        else if (date < now.value) {
            return "#D03A52";
        }

        //не просрочен
        else {
            return "";
        }
    }
}
</script>

<style>
.project_desc.n-collapse
    .n-collapse-item
    .n-collapse-item__header
    .n-collapse-item__header-main {
    font-size: large;
    flex: none;
}

.n-space .n-h1 {
    margin: 0;
}
</style>
