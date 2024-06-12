<template>
    <div class="home-task-list">
        <n-tabs type="line" animated>
            <n-tab-pane name="active" tab="Активные">
                <n-list hoverable clickable>
                    <n-list-item
                        v-for="task in active_tasks"
                        class="home-task-list-item"
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
</script>

<style></style>
