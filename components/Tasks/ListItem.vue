<template>
    <div @click="open_detail_task = true">
        <n-thing :title="'#' + props.item?.id + ' - ' + props.item?.name">
            <div class="table-task-item-body">
                <div class="table-task-item-body-col">
                    <div class="table-task-item-body-col-header">Проект</div>
                    <div class="table-task-item-body-col-content">
                        {{ props.item?.project_id ?? "Пусто" }}
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
                        <!-- <n-time
                            :time="
                                new Date(props.item?.time_to_complete * 1000)
                            "
                            format="HH:mm"
                            type="relative"
                        /> -->
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
            <template #footer>
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
                        <n-button @click.prevent="saveTask">
                            Сохранить
                        </n-button>
                        <n-button @click.prevent="cancelUpdate">
                            Отмена
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
} from "naive-ui";
import { PhPencil } from "@phosphor-icons/vue";
import { defineProps } from "vue";

const props = defineProps({
    item: Object,
});

const open_detail_task = ref(false);

const updated_mode = ref(false);

function updateTask() {
    updated_mode.value = true;
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
