<template>
    <n-button class="kanban-btn" @click="openTaskInput" v-if="!add_task">
        <div class="kanban-btn-static" :class="add_task ? 'hidden' : ''">
            <span>+</span>
            <div>Добавить задачу</div>
        </div>
    </n-button>
    <div class="kanban-btn-add-task" :class="add_task ? 'active' : ''">
        <n-form class="add-task-form" inline>
            <n-form-item>
                <n-input
                    placeholder="Заголовок"
                    v-on:keydown.enter="addTask"
                    v-model:value="task_title"
                    ref="task_input_ref"
                />
            </n-form-item>
            <n-form-item>
                <n-button @click="addTask" class="add-task-form-btn">
                    <Transition name="slide-up">
                        <PhCheck v-if="task_title != ''" :size="16" />
                        <PhX v-else :size="16" />
                    </Transition>
                </n-button>
            </n-form-item>
        </n-form>
    </div>
</template>
<script setup>
import { NButton, NForm, NFormItem, NInput, NIcon } from "naive-ui";
import { PhCheck, PhX } from "@phosphor-icons/vue";

const add_task = ref(false);
const task_title = ref("");

const new_task = ref("");

function openTaskInput() {
    add_task.value = true;
}

const emit = defineEmits("newTask");

const task_input_ref = ref(null);

function addTask() {
    if (task_title.value != "") {
        new_task.value = {
            id: 1,
            title: task_title.value,
        };
        emit("newTask", new_task.value);
        task_title.value = "";
        task_input_ref.value.focus();
    } else {
        add_task.value = false;
    }
}
</script>
<style>
.kanban-btn {
    height: 56px;
}

.kanban-btn-add-task {
    height: 56px;
    display: none;
    width: 100%;
    justify-content: space-between;
    padding: 0 10px;
    /* height: 100%; */
}

.kanban-btn-add-task.active {
    display: flex;
}

.kanban-btn-static {
    margin-left: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: center;
}

.kanban-btn-static div,
.kanban-btn-static span {
    transition: 0.3s;
}

.kanban-btn-static div {
    width: 0;
    overflow: hidden;
}

.kanban-btn:hover .kanban-btn-static div {
    width: 109px;
}

.kanban-btn-static.hidden {
    display: none;
}

.kanban-btn:has(.kanban-btn-add-task.active) > div {
    display: none;
}

.kanban-btn:has(.kanban-btn-add-task.active) {
    padding: 10px;
    width: 100%;
}

.kanban-btn:has(.kanban-btn-add-task.active) .n-button__content {
    /* height: 100%; */
    width: 100%;
    justify-content: space-between;
}

.add-task-form.n-form.n-form--inline {
    justify-content: space-between;
    align-items: center;
}

.add-task-form .n-input .n-input__input-el {
    height: 100%;
    padding: 5px 0;
    line-height: 100%;
}

.add-task-form .n-form-item.n-form-item--top-labelled {
    grid-template-areas: "blank";
    grid-template-rows: auto;
    margin: 0;
}

.add-task-form .n-form-item .n-form-item-blank {
    min-height: auto;
}

.add-task-form .n-form-item .n-form-item-feedback-wrapper {
    display: none;
}

.add-task-form-btn {
    color: #ffffff3d;
    width: 44px;
}
.add-task-form-btn svg {
    position: absolute;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
}
.slide-up-enter-active,
.slide-up-leave-active {
    transition: all 0.3s ease-out;
}

.slide-up-enter-from {
    opacity: 0;
    transform: translateY(30px);
}

.slide-up-leave-to {
    opacity: 0;
    transform: translateY(-30px);
}
</style>
