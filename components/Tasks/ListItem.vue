<template>
    <div @click="open_detail_task = true">
        <n-thing :title="'#' + props.item?.id + ' - ' + props.item?.name">
            <div class="table-task-item-body">
                <div class="table-task-item-body-col">
                    <div class="table-task-item-body-col-header">Проект</div>
                    <div class="table-task-item-body-col-content">
                        {{ props.item?.projects?.name ?? "Пусто" }}
                    </div>
                </div>
                <div class="table-task-item-body-col">
                    <div class="table-task-item-body-col-header">Дедлайн</div>
                    <div class="table-task-item-body-col-content">
                        <n-time
                            :time="new Date(props.item.deadline_time * 1000)"
                            format="dd MMMM HH:mm"
                            type="relative"
                        />
                    </div>
                </div>
                <div class="table-task-item-body-col">
                    <div class="table-task-item-body-col-header">
                        Потрачено времени
                    </div>
                    <div class="table-task-item-body-col-content">
                        <template v-if="props.item?.spent_time">
                            <n-time
                                :time="new Date(props.item?.spent_time * 1000)"
                                format="HH:mm"
                                type="relative"
                            />
                        </template>
                        <template v-else> 00:00 </template>
                        из
                        <n-time
                            :time="new Date(props.item.time_on_task * 1000)"
                            format="HH:mm"
                            type="relative"
                        />
                    </div>
                </div>
                <div class="table-task-item-body-col">
                    <div class="table-task-item-body-col-header">Важность</div>
                    <div class="table-task-item-body-col-content">
                        {{ props.item?.importance }}
                    </div>
                </div>
            </div>
        </n-thing>
    </div>
    <n-drawer
        v-model:show="open_detail_task"
        width="100%"
        style="max-width: calc(100% - 450px)"
        :on-update:show="cancelUpdate"
    >
        <n-drawer-content closable :native-scrollbar="false">
            <template #header>
                <div class="task-drawer-header">
                    Задача {{ "#" + item?.id }}
                </div>
            </template>
            <tasks-update-form
                :is_readonly="updated_mode"
                :fields="props?.item"
                :save_task="task_is_save"
                :task_id="props?.item?.id"
                @update_task="
                    () => {
                        updated_mode = false;
                        task_is_save = false;
                    }
                "
            />
            <template #footer v-if="user?.role_id == 1 || user?.role_id == 4">
                <div class="task-drawer-footer">
                    <template v-if="!updated_mode">
                        <n-button @click.prevent="updateTask">
                            <template #icon>
                                <n-icon><PhPencil /></n-icon>
                            </template>
                            Изменить
                        </n-button>
                    </template>
                    <template v-else>
                        <n-button @click="saveTask"> Сохранить </n-button>
                        <n-button @click="cancelUpdate"> Отмена </n-button>
                    </template>
                    <template v-if="props?.item?.completion_id == 2">
                        <n-button
                            @click.prevent="archiveTask(props.item?.name)"
                        >
                            Архивировать
                        </n-button>
                    </template>
                    <template v-else>
                        <n-button
                            @click.prevent="archiveTask(props.item?.name)"
                        >
                            Разархивировать
                        </n-button>
                    </template>
                </div>
            </template>
        </n-drawer-content>
    </n-drawer>
</template>

<script setup>
import {
    NThing,
    NDrawer,
    NDrawerContent,
    NButton,
    NIcon,
    NTime,
    useNotification,
    useDialog,
} from "naive-ui";
import { PhPencil } from "@phosphor-icons/vue";
import { defineProps } from "vue";
import taskApi from "~/api/tasks.js";

const user = useState("current_user");

const props = defineProps({
    item: Object,
});

const open_detail_task = ref(false);

const updated_mode = ref(false);

function updateTask() {
    updated_mode.value = true;
}

const notification = useNotification();
const dialog = useDialog();

function archiveTask(title) {
    let data;

    if (props?.item?.completion_id == 2) {
        data = {
            completion_id: 1,
        };

        dialog.warning({
            showIcon: false,
            title: "Подтверждение",
            content:
                "Вы уверены, что хотите архивировать " + `"${title}"` + "?",
            negativeText: "Нет",
            positiveText: "Да",
            onPositiveClick: async () => {
                const result = await taskApi.updateTask(props?.item?.id, data);

                if (result.success) {
                    notification.success({
                        content: "Задача создана.",
                        duration: 10000,
                    });
                    open_detail_task.value = false;
                }
            },
            positiveButtonProps: {
                type: "primary",
            },
        });
    } else {
        data = {
            completion_id: 2,
        };

        dialog.warning({
            showIcon: false,
            title: "Подтверждение",
            content:
                "Вы уверены, что хотите разархивировать " + `"${title}"` + "?",
            negativeText: "Нет",
            positiveText: "Да",
            onPositiveClick: async () => {
                const result = await taskApi.updateTask(props?.item?.id, data);

                if (result.success) {
                    notification.success({
                        content: "Задача создана.",
                        duration: 10000,
                    });
                    open_detail_task.value = false;
                }
            },
            positiveButtonProps: {
                type: "primary",
            },
        });
    }
}

function cancelUpdate(value) {
    if (!value) {
        open_detail_task.value = false;
        updated_mode.value = false;
    } else {
        updated_mode.value = false;
    }
}

const task_is_save = ref(false);

function saveTask() {
    task_is_save.value = false;
    task_is_save.value = true;
}
</script>
<style>
.table-task-item-body {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
}

.table-task-item-body-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
}

.table-task-item-body-col:nth-child(1) {
    align-items: flex-start;
}

.table-task-item-body-col:nth-child(4) {
    align-items: flex-end;
}

.table-task-item-body-col-header {
    font-weight: 500;
}

.table-task-item-body-col-content {
}

.task-drawer-header {
    display: flex;
    gap: 10px;
}

.task-drawer-footer {
    display: flex;
    align-items: center;
    gap: 20px;
}

.n-drawer .n-drawer-content .n-drawer-footer:has(.task-drawer-footer) {
    justify-content: flex-start;
}
</style>
