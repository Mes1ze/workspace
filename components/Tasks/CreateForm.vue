<template>
    <n-form ref="form_ref" :model="form_data" :rules="form_rules">
        <n-form-item label="Название" path="name">
            <n-input
                v-model:value="form_data.name"
                placeholder="Укажите название задачи"
            />
        </n-form-item>
        <n-form-item label="Дата" path="release_time">
            <n-date-picker
                v-model:value="form_data.release_time"
                type="date"
                format="dd MMMM yyyy"
                :first-day-of-week="0"
                placeholder="Укажите дату постановки"
                style="width: 100%"
            />
            <!-- style="width: 472px; max-width: 100%" -->
        </n-form-item>
        <n-form-item label="Время на выполнение" path="time_on_task">
            <n-time-picker
                v-model:value="form_data.time_on_task"
                default-formatted-value="10:00"
                format="HH:mm"
                placeholder="Укажите время на выполнение"
                style="width: 100%"
            />
        </n-form-item>
        <n-form-item label="Важность" path="importance">
            <n-input-number
                v-model:value="form_data.importance"
                placeholder="Введите важность"
                style="width: 100%"
                :max="10"
                :min="1"
            />
        </n-form-item>
        <n-form-item label="Постановщик" path="director">
            <n-select
                filterable
                v-model:value="form_data.director"
                placeholder="Укажите постановщика"
                :options="director_list_options"
            />
        </n-form-item>
        <n-form-item label="Срок сдачи" path="deadline_time">
            <n-date-picker
                v-model:value="form_data.deadline_time"
                type="date"
                format="dd MMMM yyyy"
                :first-day-of-week="0"
                placeholder="Укажите дату сдачи"
                style="width: 100%"
            />
        </n-form-item>
        <n-form-item label="Описание" path="description">
            <n-input
                v-model:value="form_data.description"
                type="textarea"
                placeholder="Укажите описание"
            />
        </n-form-item>
        <n-form-item label="Проект" path="project_id">
            <n-select
                filterable
                v-model:value="form_data.project_id"
                placeholder="Укажите проект к которому относится задача"
                :options="projects_list_options"
            />
        </n-form-item>
        <n-button @click="create"> Создать задачу </n-button>
    </n-form>
</template>

<script setup>
import TasksApi from "~/api/tasks";
import {
    NForm,
    NFormItem,
    NInput,
    NSelect,
    NDatePicker,
    NButton,
    NTimePicker,
    NInputNumber,
    useNotification,
} from "naive-ui";

const emit = defineEmits(["newTask", "openDrawer"]);

const form_ref = ref(null);
const form_data = reactive({
    name: null,
    release_time: null, // текущая дата при создании
    time_on_task: null,
    importance: 5,
    director: null, // id usera который создал
    deadline_time: null,
    description: null,
    project_id: null,
});

const form_rules = {
    name: {
        required: true,
        message: "Обязательное поле",
        trigger: ["input", "blur"],
    },
    release_time: {
        required: true,
        message: "Обязательное поле",
    },
    director: {
        required: true,
        message: "Обязательное поле",
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

const notification = useNotification();

async function create(e) {
    e.preventDefault();
    await form_ref.value.validate(async (errors) => {
        if (!errors) {
            let data = {
                name: form_data.name,
                release_time: form_data.release_time / 1000, // текущая дата при создании
                time_on_task: form_data.time_on_task / 1000,
                importance: form_data.importance,
                director: form_data.director, // id usera который создал
                deadline_time: form_data.deadline_time / 1000,
                description: form_data.description,
                project_id: form_data.project_id,
            };

            const result = await TasksApi.create(data);
            if (result.success) {
                notification.success({
                    content: "Задача создана.",
                    duration: 10000,
                });
                // emit("newTask", result.data);
                data = null;
                form_data.name = null;
                form_data.release_time = null;
                form_data.time_on_task = null;
                form_data.importance = 5;
                form_data.director = null;
                form_data.deadline_time = null;
                form_data.description = null;
                form_data.project_id = null;
                emit("openDrawer");
            }
        } else {
            notification.error({
                content: "Неверные данные формы!",
                duration: 10000,
            });
        }
    });
}
</script>
