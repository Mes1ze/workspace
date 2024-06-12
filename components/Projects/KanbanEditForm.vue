<template>
    <div style="display: flex; justify-content: space-between">
        Режим редактирования
        <n-switch
            v-model:value="is_read"
            @update:value="handleChange"
            size="large"
        >
            <template #unchecked-icon>
                <n-icon :component="CloseOutline" color="#5457F5" />
            </template>
            <template #checked-icon>
                <n-icon :component="CreateOutline" color="#5457F5" />
            </template>
        </n-switch>
    </div>
    <n-form ref="form_ref" :model="form_data">
        <n-form-item label="Название" path="title">
            <n-input
                :readonly="!is_read"
                v-model:value="form_data.title"
                :placeholder="task_info.title"
            />
        </n-form-item>
        <n-form-item label="Описание" path="description">
            <n-input
                :readonly="!is_read"
                v-model:value="form_data.description"
                type="textarea"
                :placeholder="task_info.description"
            />
        </n-form-item>
        <n-form-item label="Комментарий" path="comment">
            <n-input
                :readonly="!is_read"
                v-model:value="form_data.comment"
                type="textarea"
                placeholder="Опишите проект"
            />
        </n-form-item>
        <n-form-item label="Ответственный" path="responsible">
            <n-select
                :disabled="!is_read"
                filterable
                v-model:value="form_data.responsible"
                placeholder="Укажите ответственного"
                :options="responsoble_list_options"
            />
        </n-form-item>

        <n-form-item label="Срок сдачи" path="deadline">
            <n-date-picker
                :disabled="!is_read"
                type="date"
                v-model:value="form_data.deadline"
                style="width: 100%"
                :placeholder="task_info.deadline"
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
    NIcon,
    NSwitch,
} from "naive-ui";
import { CreateOutline, CloseOutline } from "@vicons/ionicons5";

const is_read = ref(false);

const task_info = useState("task_card");

const form_ref = ref(null);
const form_data = reactive({
    title: "",
    description: "",
    comment: "",
    customer: "",
    responsible: null,
    deadline: null,
});

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

function update(e) {
    e.preventDefault();
    form_ref.value.validate(async (errors) => {
        if (errors) {
            return;
        }

        const res = await projectApi.updateProject(form_data, 1);

        emit("newData", res);
    });
}
</script>
