<template>
    <div class="kanban-header">
        <div class="kanban-header-static" :class="is_edit ? 'hidden' : ''">
            <div class="kanban-header-left">
                <div class="kanban-header-title">
                    {{ title }}
                </div>
                <div class="kanban-header-tasks">
                    ( {{ props?.header?.items.length }} )
                </div>
            </div>
            <n-dropdown
                :options="options"
                class="kanban-header-right"
                trigger="click"
                @select="handleSelect"
            >
                <n-button>
                    <svg
                        fill="#FFFFFF"
                        height="18"
                        viewBox="0 0 24 24"
                        width="18"
                    >
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path
                            d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                        />
                    </svg>
                </n-button>
            </n-dropdown>
        </div>
        <div class="kanban-header-update" :class="is_edit ? 'active' : ''">
            <n-form class="update-kanban-header" inline>
                <n-form-item>
                    <n-input
                        v-on:keydown.enter="updateHeader"
                        v-model:value="column_title"
                        ref="input"
                    />
                </n-form-item>
                <n-form-item>
                    <n-button @click="cancelUpdate"
                        ><svg
                            width="20"
                            height="20"
                            viewBox="0 0 16 16"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M4.11 2.697L2.698 4.11 6.586 8l-3.89 3.89 1.415 1.413L8 9.414l3.89 3.89 1.413-1.415L9.414 8l3.89-3.89-1.415-1.413L8 6.586l-3.89-3.89z"
                                fill="#fff"
                            ></path>
                        </svg>
                    </n-button>
                </n-form-item>
                <n-form-item>
                    <n-button @click="updateHeader">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 16 16"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M14.059 4.965l-1.414-1.414-6.61 6.61-2.567-2.567-1.414 1.414 2.567 2.567 1.414 1.414 1.414-1.414 6.61-6.61z"
                                fill="#fff"
                            ></path>
                        </svg>
                    </n-button>
                </n-form-item>
            </n-form>
        </div>
    </div>
</template>
<script setup>
import {
    NDropdown,
    NButton,
    NForm,
    NFormItem,
    NInput,
    useDialog,
    useNotification,
} from "naive-ui";

const notification = useNotification();
const dialog = useDialog();

const props = defineProps({
    header: Object,
    index: Number,
    is_edit: Boolean,
});

const header_index = ref(props?.index);
const is_edit = ref(props?.is_edit);

const emit = defineEmits();

const options = [
    {
        label: "Редактировать",
        key: "editColumn",
    },
    {
        label: "Добавить колонку справа",
        key: "addColumn",
    },
    {
        label: "Удалить колонку",
        key: "removeColumn",
    },
];

const column_title = ref("");
const input = ref(null);
const title = ref(props?.header?.header);

async function updateColumn() {
    is_edit.value = true;
    column_title.value = title.value;
    await nextTick();
    input.value.focus();
    emit("updateColumn", column_title.value, header_index.value);
}

const new_column = reactive({
    //  column_id: header_index.value + 1,
    task_input: false,
    is_edit: false,
    header: column_title.value,
    items: [],
});

async function addColumn(new_column, index) {
    emit("addNewColumn", new_column, index);
}

function removeColumn(title, index) {
    if (props?.header?.items.length > 0) {
        dialog.warning({
            showIcon: false,
            title: "Подтверждение",
            content:
                "Вы уверены, что хотите удалить колонку " +
                `"${title}"` +
                "?\n    Все данные колонки будут удалены!",
            negativeText: "Нет",
            positiveText: "Да",
            onPositiveClick: () => {
                emit("removeColumn", index);
            },
            positiveButtonProps: {
                type: "primary",
            },
        });
    } else {
        emit("removeColumn", index);
    }
}

function handleSelect(key) {
    switch (key) {
        case "editColumn":
            updateColumn();
            break;
        case "addColumn":
            addColumn(new_column, header_index.value);
            break;
        case "removeColumn":
            removeColumn(title.value, header_index.value);
            break;
    }
}

function updateHeader() {
    if (column_title.value != "") {
        title.value = column_title.value;
        is_edit.value = false;
        emit("updateColumn", column_title.value, header_index.value);
    } else {
        notification.error({
            content: "Введите название колонки!",
            duration: 10000,
        });
    }
}

function cancelUpdate() {
    is_edit.value = false;
    column_title.value = title.value;
}
</script>
<style>
.kanban-header {
    background-color: #5457f5;
    border-radius: 3px;
    padding: 11px 10px;
}
.kanban-header-static {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
}
.kanban-header-static.hidden {
    display: none;
}
.kanban-header-left {
    display: flex;
    gap: 5px;
    max-width: calc(100% - 71px);
}
.kanban-header-title {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #fff;
}
.kanban-header-tasks {
    color: #fff;
    font-size: 12px;
    align-self: center;
}
.kanban-header-right {
}

.kanban-header-update {
    display: none;
}
.kanban-header-update.active {
    display: flex;
}

.update-kanban-header.n-form.n-form--inline {
    justify-content: space-between;
    align-items: center;
}

.update-kanban-header .n-input .n-input__input-el {
    height: 100%;
    padding: 5px 0;
    line-height: 100%;
}

.update-kanban-header .n-form-item.n-form-item--top-labelled {
    grid-template-areas: "blank";
    grid-template-rows: auto;
}

.update-kanban-header .n-form-item .n-form-item-blank {
    min-height: auto;
}

.update-kanban-header .n-form-item .n-form-item-feedback-wrapper {
    display: none;
}
.update-kanban-header .n-form-item.n-form-item--top-labelled {
    margin: 0;
}
.update-kanban-header .n-button {
    padding: 7px;
    height: auto;
}
.update-kanban-header .n-button > div {
    display: none;
}
.update-kanban-header .n-button .n-button__content {
    color: #fff;
    font-size: 15px;
}
</style>
