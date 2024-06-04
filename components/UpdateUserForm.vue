<template>
    <n-form ref="form_ref" :model="form_data" :rules="form_rules">
        <n-form-item label="Фамилия" path="surname">
            <n-input
                v-model:value="form_data.surname"
                placeholder="Введите вашу фамилию"
            />
        </n-form-item>
        <n-form-item label="Имя" path="firstname">
            <n-input
                v-model:value="form_data.firstname"
                placeholder="Введите ваше имя"
            />
        </n-form-item>
        <n-form-item label="Отчество" path="fathername">
            <n-input
                v-model:value="form_data.fathername"
                placeholder="Введите ваше отчество"
            />
        </n-form-item>
        <n-button @click="update"> Изменить </n-button>
    </n-form>
</template>
<script setup>
import { NForm, NFormItem, NInput, NButton, useNotification } from "naive-ui";
import userApi from "~/api/user.js";

const props = defineProps({
    user: Object,
});
const form_ref = ref(null);
const form_data = ref({
    surname: props.user.surname,
    firstname: props.user.firstname,
    fathername: props.user.fathername,
});

const form_rules = {
    surname: {
        trigger: ["blur", "input"],
        required: true,
        message: "Обязательное поле"
    },
    firstname: {
        trigger: ["blur", "input"],
        required: true,
        message: "Обязательное поле"
    },
};

const emit = defineEmits("openDrawer");
const notification = useNotification();

async function update(e) {
    e.preventDefault();
    await form_ref.value.validate(async (errors) => {
        if (!errors) {
            const result = await userApi.updateUser(form_data.value);
            if (result.success) {
                const user = useState("current_user");
                user.value = result?.data;
                notification.success({
                    content: "Данные обновлены.",
                    duration: 10000,
                });
                form_data.value.fathername = null;
                form_data.value.firstname = null;
                form_data.value.surname = null;
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
