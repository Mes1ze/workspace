<template>
    <n-form ref="form_ref" :model="form_data" :rules="form_rules">
        <n-form-item label="Название" path="name">
            <n-input
                v-model:value="form_data.name"
                placeholder="Укажите название проекта"
            />
        </n-form-item>
        <n-form-item label="Заказчик" path="customer">
            <n-input
                v-model:value="form_data.customer"
                placeholder="Укажите заказчика"
            />
        </n-form-item>
        <n-form-item label="Описание" path="description">
            <n-input
                v-model:value="form_data.description"
                type="textarea"
                placeholder="Опишите проект"
            />
        </n-form-item>
        <n-form-item label="Ответственный" path="responsoble_id">
            <n-select
                filterable
                v-model:value="form_data.responsoble_id"
                placeholder="Укажите ответственного"
                :options="responsoble_list_options"
            />
        </n-form-item>
        <n-form-item label="Срок сдачи" path="deadline">
            <n-date-picker
                type="date"
                v-model:value="form_data.deadline"
                style="width: 100%"
            />
        </n-form-item>
        <n-button @click="create"> Создать проект </n-button>
    </n-form>
</template>

<script setup>
import projectApi from "~/api/project";
import {
    NForm,
    NFormItem,
    NInput,
    NSelect,
    NDatePicker,
    NButton,
} from "naive-ui";

const form_ref = ref(null);
const form_data = reactive({
    name: "",
    customer: "",
    description: "",
    responsoble_id: null,
    deadline: null,
});

const form_rules = {
    name: {
        required: true,
        message: "Обязательное поле",
        trigger: ["input", "blur"],
    },
};

const responsoble_list_options = [
    {
        label: "Олег Бардак",
        value: 1,
    },
    {
        label: "Степан Кубасов",
        value: 2,
    },
];

async function create(e) {
    e.preventDefault();
    await form_ref.value.validate(async (errors) => {
        if (!errors) {
            const result = await projectApi.create(form_data);
            if (result.success) {
                notification.success({
                    content: "Задача создана.",
                    duration: 10000,
                });
                // emit("newTask", result.data);
                form_data.name = null;
                form_data.customer = null;
                form_data.description = null;
                form_data.responsoble_id = null;
                form_data.deadline = null;
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
