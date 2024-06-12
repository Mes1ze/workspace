<template>
    <div>
        <n-card hoverable class="kanban-task-card" :id="props?.card?.id">
            <!-- @click="open_detail_task = true" -->
            <div class="kanban-task-card-title">
                {{ props?.card?.title }}
            </div>
            <!-- <div class="kanban-task-card-deadline">до 20.20.2024</div> -->
            <div class="kanban-task-card-id">ID {{ props?.card?.id }}</div>
            <div class="kanban-task-card-responsible">
                {{ user?.surname + " " + user?.firstname }}
            </div>
        </n-card>

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
    </div>
</template>
<script setup>
import {} from "naive-ui";
import { PhPencil } from "@phosphor-icons/vue";
import {
    NCard,
    NThing,
    NDrawer,
    NDrawerContent,
    NButton,
    NIcon,
    NTime,
} from "naive-ui";
const props = defineProps({
    card: Object,
    item: Object,
});
const user = useState("current_user");

const open_edit_task = useState("edit_task");
open_edit_task.value = false;

// function openToUpdate(card) {
//     open_edit_task.value = true;
//     const task_card = useState("task_card");
//     task_card.value = card;
// }

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
.kanban-task-card.n-card > .n-card__content,
.kanban-task-card.n-card > .n-card__footer {
    padding: 0;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.kanban-task-card-title {
    display: block;
    overflow: hidden;
    position: relative;
    max-width: 100%;
    font-weight: 500;
    color: currentColor;
    max-height: 68px;
    line-height: 120%;
    cursor: pointer;
    text-overflow: ellipsis;
    -webkit-line-clamp: 4;
    display: -webkit-box;
    -webkit-box-orient: vertical;
}

.kanban-task-card-deadline {
    font-size: 10px;
}

.kanban-task-card-id {
    font-weight: 500;
}

.kanban-task-card-responsible {
}
</style>
