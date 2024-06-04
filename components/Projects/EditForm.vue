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
        <n-form-item label="Ответственный" path="responsible_id">
            <n-select
                filterable
                v-model:value="form_data.responsible_id"
                placeholder="Укажите ответственного"
                :options="responsoble_list_options"
            />
        </n-form-item>
        <n-form-item label="Описание" path="description">
            <n-input
                v-model:value="form_data.description"
                type="textarea"
                placeholder="Опишите проект"
            />
        </n-form-item>
        <n-form-item label="Срок сдачи" path="deadline">
            <n-date-picker
                type="date"
                v-model:value="form_data.deadline"
                style="width: 100%"
            />
        </n-form-item>
        <n-button @click="update"> Сохранить </n-button>
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
    responsible_id: null,
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
        label: "Стапан Кубасов",
        value: 1,
    },
    {
        label: "Олег Бардак",
        value: 2,
    },
];

const emit = defineEmits(['newData'])

function update(e) {
    e.preventDefault();
    form_ref.value.validate(async (errors) => {
        if (errors) {
            return;
        }

        const res = await projectApi.updateProject(form_data, 1);

        emit('newData', res);
    });
}
</script>
