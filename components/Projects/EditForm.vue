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
                format="dd MMMM yyyy"
                :first-day-of-week="0"
                v-model:value="form_data.deadline"
                style="width: 100%"
            />
        </n-form-item>
        <n-button @click.prevent="update"> Сохранить </n-button>
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
    useNotification,
} from "naive-ui";

const props = defineProps({
    data: Object,
    id: String,
});

const form_ref = ref(null);
const form_data = reactive({
    name: props?.data?.name,
    customer: props?.data?.customer,
    description: props?.data?.description,
    responsible_id: props?.data?.responsible_id,
    deadline: Number(props?.data?.deadline * 1000),
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

const emit = defineEmits(["newData"]);

const notification = useNotification();

async function update() {
    await form_ref.value.validate(async (errors) => {
        if (!errors) {
            const data = {
                name: form_data.name,
                customer: form_data.customer,
                description: form_data.description,
                responsible_id: form_data.responsible_id,
                deadline: (form_data.deadline / 1000).toString() ?? null,
            };

            const res = await projectApi.updateProject(data, props?.id);

            if (res.success) {
                notification.success({
                    content: "Данные обновлены.",
                    duration: 10000,
                });
                emit("newData");
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
