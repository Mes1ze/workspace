<template>
    <!-- <n-h1>Проект {{ route.params.id }}</n-h1> -->
    <n-space
        horizontal
        :size="60"
        :align="'flex-end'"
        style="margin-bottom: 40px"
    >
        <n-h1>{{ res?.data?.name }}</n-h1>
        <n-space
            horizontal
            :size="20"
            :align="'center'"
            v-if="user?.role_id == 1 || user?.role_id == 4"
        >
            <n-button @click="open_edit_form = true"> Редактировать </n-button>
            <template v-if="res?.data?.is_archive == '0'">
                <n-button @click="archiveProject"> Архивировать </n-button>
            </template>
            <template v-else>
                <n-button @click="archiveProject"> Разархивировать </n-button>
            </template>
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
                <template
                    v-if="res?.data.responsible_id == res?.data?.employee?.id"
                >
                    {{
                        res?.data?.employee?.firstname +
                        " " +
                        res?.data?.employee?.surname
                    }}
                </template>
                <template v-else>-</template>
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
            <projects-edit-form
                @newData="open_edit_form = false"
                :data="res?.data"
                :id="route?.params?.id"
            />
        </n-drawer-content>
    </n-drawer>

    <!-- Редактирование задачи -->
    <!-- <n-drawer v-model:show="open_edit_task" width="90%">
        <n-drawer-content
            closable
            title="Редактирование задачи"
            :native-scrollbar="false"
        >
            <kanban-edit-form @newData="getNewData" />
        </n-drawer-content>
    </n-drawer> -->
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
    useNotification,
} from "naive-ui";
import projectsApi from "~/api/project.js";
import KanbanEditForm from "~/components/Projects/KanbanEditForm.vue";

const user = useState("current_user");

const now = ref(new Date());
const end = new Date("2024-03-01 GMT+3");

if (process.client) {
    setInterval(() => {
        now.value = new Date();
    }, 1000);
}
const res = ref(null);
const route = useRoute();
res.value = await projectsApi.getProject(route.params.id);

const days_before_deadline = computed(() => {
    return new Date(res?.value?.data.deadline * 1000 - 259200000);
});

const current_stage = ref(1);
current_stage.value = res.value?.data?.stages_id;

const open_edit_form = ref(false);
const open_edit_task = useState("edit_task");
open_edit_task.value = false;

const dialog = useDialog();

function setStage(step, index) {
    if (user.value?.role_id == 1 || user.value?.role_id == 4) {
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
}

function sumbit(index) {
    current_stage.value = index + 1;
}

function getNewData(new_data) {
    res.value.data = new_data;
}

function getStatus(step) {
    if (step.id < res?.value?.data?.stage_id) {
        return "finish";
    } else if (step.id == res?.value?.data?.stage_id) {
        return "process";
    } else {
        return "wait";
    }
}

const dark_theme = useState("dark_theme");

function deadlineColor(timestamp) {
    let date = new Date(timestamp * 1000);
    if (res.value.data?.is_archive != "1") {
        //3 дня до сдачи
        if (days_before_deadline.value < now.value && now.value < date) {
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
const notification = useNotification();

async function archiveProject() {
    let data;
    if (res.value.data?.is_archive == "0") {
        data = {
            is_archive: "1",
        };
    } else {
        data = {
            is_archive: "0",
        };
    }
    const result = await projectsApi.updateProject(data, route.params.id);

    if (result.success) {
        notification.success({
            content: "Данные обновлены.",
            duration: 10000,
        });
    }
}

let socket;

onMounted(() => {
    if (process.client) {
        socket = new WebSocket(
            "ws://localhost:3000/ws/projects/" + route.params.id
        );

        socket.addEventListener("message", (event) => {
            const data = JSON.parse(event.data);

            if (data?.action == "update") {
                res.value.data = Object.assign(res.value.data, data.project);
            }
        });
    }
});
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
