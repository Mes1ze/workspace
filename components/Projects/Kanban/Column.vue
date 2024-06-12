<template>
    <div class="kanban-column">
        <div class="kanban-column-header">
            <ProjectsKanbanHeader
                :header="props?.column"
                :index="props?.index"
                :is_edit="props?.column?.is_edit"
                @addNewColumn="addNewColumn"
                @removeColumn="removeColumn"
                @updateColumn="updateColumn"
            />
            <ProjectsKanbanButton
                @newTask="addTask"
                v-if="user?.role_id == 1 || user?.role_id == 4"
            />
        </div>
        <n-scrollbar>
            <draggable
                class="kanban-tasks-group"
                :list="column_tasks"
                group="tasks"
            >
                <template #item="{ element }">
                    <ProjectsKanbanCard :card="element" />
                </template>
            </draggable>
        </n-scrollbar>
    </div>
    <!-- <transition-group> -->
    <!-- </transition-group> -->
</template>
<script setup>
import draggable from "vuedraggable";
import { NScrollbar } from "naive-ui";

const user = useState("current_user");

const props = defineProps({
    index: Number,
    column: Object,
    random_id: Number,
});

const emit_add = defineEmits();

const column_tasks = ref(null);
column_tasks.value = props?.column?.items;

const random_id = ref(props?.random_id);

function addTask(task) {
    random_id.value = randomInteger(random_id.value + 1, random_id.value + 10);
    task.id = random_id.value;

    column_tasks.value.unshift(task);
}

function addNewColumn(new_column, index) {
    emit_add("addNewColumn", new_column, index);
}

function removeColumn(column_id) {
    emit_add("removeColumn", column_id);
}

function updateColumn(column_title, index) {
    emit_add("updateColumn", column_title, index);
}
</script>
