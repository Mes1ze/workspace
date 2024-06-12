<template>
    <n-form ref="form_ref" :model="form_data" :rules="form_rules">
        <n-form-item label="Название" path="name">
            <template v-if="!is_readonly">
                <div class="task-item-readonly">
                    {{ form_data.name }}
                </div>
            </template>
            <template v-else>
                <n-input
                    v-model:value="form_data.name"
                    placeholder="Укажите название задачи"
                />
            </template>
        </n-form-item>
        <n-form-item label="Дата" path="release_time">
            <template v-if="!is_readonly">
                <div class="task-item-readonly">
                    {{ release_time_readonly }}
                </div>
            </template>
            <template v-else>
                <n-date-picker
                    v-model:value="form_data.release_time"
                    type="date"
                    format="dd MMMM yyyy"
                    :first-day-of-week="0"
                    placeholder="Укажите дату постановки"
                    style="width: 100%"
                />
            </template>
        </n-form-item>
        <n-form-item label="Время на выполнение" path="time_on_task">
            <template v-if="!is_readonly">
                <div class="task-item-readonly">
                    {{ time_on_task_readonly }}
                </div>
            </template>
            <template v-else>
                <n-time-picker
                    v-model:value="form_data.time_on_task"
                    default-formatted-value="10:00"
                    format="HH:mm"
                    placeholder="Укажите время на выполнение"
                    style="width: 100%"
                />
            </template>
        </n-form-item>
        <n-form-item label="Важность" path="importance">
            <template v-if="!is_readonly">
                <div class="task-item-readonly">
                    {{ form_data.importance }}
                </div>
            </template>
            <template v-else>
                <n-input-number
                    v-model:value="form_data.importance"
                    placeholder="Введите важность"
                    style="width: 100%"
                    :max="10"
                    :min="1"
                />
            </template>
        </n-form-item>
        <n-form-item label="Постановщик" path="director">
            <template v-if="!is_readonly">
                <div class="task-item-readonly">
                    {{
                        director_list_options.find(
                            (item, index) => index + 1 == form_data.director
                        )?.label
                    }}
                    <!-- 123 -->
                </div>
            </template>
            <template v-else>
                <n-select
                    filterable
                    v-model:value="form_data.director"
                    placeholder="Укажите постановщика"
                    :options="director_list_options"
                />
            </template>
        </n-form-item>
        <n-form-item label="Срок сдачи" path="deadline_time">
            <template v-if="!is_readonly">
                <div class="task-item-readonly">
                    {{ deadline_readonly }}
                </div>
            </template>
            <template v-else>
                <n-date-picker
                    v-model:value="form_data.deadline_time"
                    type="date"
                    format="dd MMMM yyyy"
                    :first-day-of-week="0"
                    placeholder="Укажите дату сдачи"
                    style="width: 100%"
                />
            </template>
        </n-form-item>
        <n-form-item label="Описание" path="description">
            <template v-if="!is_readonly">
                <div class="task-item-readonly textarea">
                    {{ form_data.description }}
                </div>
            </template>
            <template v-else>
                <n-input
                    v-model:value="form_data.description"
                    type="textarea"
                    placeholder="Укажите описание"
                />
            </template>
        </n-form-item>
        <n-form-item label="Проект" path="project_id">
            <template v-if="!is_readonly">
                <div class="task-item-readonly">
                    {{
                        projects_list_options.find(
                            (item, index) => item?.value == form_data.project_id
                        )?.label
                    }}
                    <!-- 123 -->
                </div>
            </template>
            <template v-else>
                <n-select
                    filterable
                    v-model:value="form_data.project_id"
                    placeholder="Укажите проект к которому относится задача"
                    :options="projects_list_options"
                />
            </template>
        </n-form-item>
    </n-form>
</template>

<script setup>
import {
    NForm,
    NFormItem,
    NInput,
    NSelect,
    NDatePicker,
    NTimePicker,
    NInputNumber,
    useNotification,
} from "naive-ui";
import taskApi from "~/api/tasks.js";

const props = defineProps({
    is_readonly: Boolean,
    fields: Object,
    save_task: Boolean,
    task_id: Number,
});

const form_ref = ref(null);
const form_data = reactive({
    name: props?.fields?.name,
    release_time: props?.fields?.release_time * 1000,
    time_on_task: props?.fields?.time_on_task * 1000,
    importance: props?.fields?.importance,
    director: props?.fields?.director,
    deadline_time: props?.fields?.deadline_time * 1000,
    description: props?.fields?.description,
    project_id: props?.fields?.project_id,
});

const form_rules = {
    name: {
        required: true,
        message: "Обязательное поле",
        trigger: ["input", "blur"],
    },
    release_time: {
        type: "number",
        required: true,
        message: "Обязательное поле",
        trigger: ["blur", "change"],
    },
    director: {
        type: "number",
        required: true,
        message: "Обязательное поле",
        trigger: ["blur", "change"],
    },
};

const director_list_options = [
    {
        label: "Олег Бардак",
        value: 1,
    },
    {
        label: "Степан Кубасов",
        value: 2,
    },
];

const projects_list_options = [
    {
        label: "Работа с тканями (Fabrixx)",
        value: 2,
    },
    // {
    //     label: "Workspace",
    //     value: 2,
    // },
];

const deadline_readonly = computed(() => {
    let date = new Date(props?.fields?.deadline_time * 1000);
    let year = date.getFullYear();
    let month_index = date.getMonth();
    let day = date.getDate().toString().padStart(2, "0");
    // let hours = date.getHours();
    // let minutes = date.getMinutes().toString().padStart(2, "0");

    let month = months.find((item, index) => index == month_index);

    return day + " " + month + " " + year;
});

const time_on_task_readonly = computed(() => {
    let date = new Date(props?.fields?.time_on_task * 1000);
    // let year = date.getFullYear();
    let month_index = date.getMonth();
    // let day = date.getDate().toString().padStart(2, "0");
    let hours = date.getHours();
    let minutes = date.getMinutes().toString().padStart(2, "0");

    // let month = months.find((item, index) => index == month_index);

    return hours.toString().padStart(2, "0") + ":" + minutes;
});

const release_time_readonly = computed(() => {
    let date = new Date(props?.fields?.release_time * 1000);
    let year = date.getFullYear();
    let month_index = date.getMonth();
    let day = date.getDate().toString().padStart(2, "0");
    // let hours = date.getHours();
    // let minutes = date.getMinutes().toString().padStart(2, "0");

    let month = months.find((item, index) => index == month_index);

    return day + " " + month + " " + year;
});

let months = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
];

const emit = defineEmits("update_task");

const notification = useNotification();
async function saveTask() {
    await form_ref.value.validate(async (errors) => {
        if (!errors) {
            const data = {
                name: form_data.name,
                release_time: (form_data.release_time / 1000).toString(),
                time_on_task: (form_data.time_on_task / 1000).toString(),
                importance: form_data.importance,
                director: form_data.director,
                deadline_time: (form_data.deadline_time / 1000).toString(),
                description: form_data.description,
                project_id: form_data.project_id,
            };

            const result = await taskApi.updateTask(props?.task_id, data);

            if (result.success) {
                notification.success({
                    content: "Данные обновлены.",
                    duration: 10000,
                });
                emit("update_task");
            }
        } else {
            notification.error({
                content: "Неверные данные формы!",
                duration: 10000,
            });
        }
    });
}

watch(
    () => props?.save_task,
    (new_value) => {
        if (new_value) {
            saveTask();
        }
    }
);
</script>
<style>
.task-item-readonly {
    height: 34px;
    padding: 0 12px;
    line-height: 34px;
}

.task-item-readonly.textarea {
    height: 80px;
}
</style>
