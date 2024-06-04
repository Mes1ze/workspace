<template>
    <div class="task-list">
        <n-tabs type="line" animated>
            <n-tab-pane name="active" tab="Активные">
                <n-list hoverable clickable>
                    <n-list-item
                        v-for="task in active_tasks"
                        class="task-list-item"
                    >
                        <tasks-list-item :item="task" />
                    </n-list-item>
                </n-list>
            </n-tab-pane>
            <n-tab-pane name="archive" tab="Архивные">
                <n-list hoverable clickable>
                    <n-list-item
                        v-for="task in archive_tasks"
                        class="task-list-item"
                    >
                        <tasks-list-item :item="task" />
                    </n-list-item>
                </n-list>
            </n-tab-pane>
        </n-tabs>
    </div>
</template>

<script setup>
import { NTabs, NTabPane, NList, NListItem } from "naive-ui";
import { computed } from "vue";

const props = defineProps({
    tasks: {
        type: Array,
        default: () => {
            return [];
        },
    },
});

const active_tasks = computed(() => {
    return props.tasks.filter(
        (task) => task.completion_scores.name == "progress"
    );
});
const archive_tasks = computed(() => {
    return props.tasks.filter(
        (task) => task.completion_scores.name == "completed"
    );
});
</script>

<style>
.task-list .task-list-item:not(:last-of-type) {
    margin-bottom: 20px;
}

.task-list-item {
    border: 1px solid rgb(239, 239, 245);
}

.task-list-item .n-list-item__divider {
    display: none;
}
</style>
