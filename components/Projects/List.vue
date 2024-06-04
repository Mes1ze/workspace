<template>
    <div class="projects-list">
        <n-tabs type="line" animated>
            <n-tab-pane name="active" tab="Активные">
                <n-list hoverable clickable>
                    <n-list-item
                        v-for="project in active_projects"
                        class="project-list-item"
                    >
                        <projects-list-item :item="project" />
                    </n-list-item>
                </n-list>
            </n-tab-pane>
            <n-tab-pane name="archive" tab="Архивные">
                <n-list hoverable clickable>
                    <n-list-item
                        v-for="project in archive_projects"
                        class="project-list-item"
                    >
                        <projects-list-item :item="project" />
                    </n-list-item>
                </n-list>
            </n-tab-pane>
        </n-tabs>
    </div>
</template>

<script setup>
import { NTabs, NTabPane, NList, NListItem } from "naive-ui";

const props = defineProps({
    projects: {
        type: Array,
        default: () => {
            return [];
        },
    },
});

const active_projects = computed(() => {
    return props.projects.filter((project) => project.is_archive == "0");
});

const archive_projects = computed(() => {
    return props.projects.filter((project) => project.is_archive == "1");
});
</script>

<style>
.project-list-item {
    margin-bottom: 20px;
    border: 1px solid rgb(239, 239, 245);
}

.project-list-item:last-child {
    margin-bottom: 0;
}

.project-list-item .n-list-item__divider {
    display: none;
}
</style>
