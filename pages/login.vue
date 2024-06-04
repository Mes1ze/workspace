<template>
    <div class="login-page">
        <n-form ref="formRef" :model="login_form" :rules="rules" size="large">
            <img src="~/assets/img/logo.svg" alt="" style="width: 280px; margin-bottom: 30px; mix-blend-mode: difference;">
            <n-form-item label="Логин" path="login">
                <n-input v-model:value="login_form.login" placeholder="Введите логин" style="width: 280px" />
            </n-form-item>
            <n-form-item label="Пароль" path="password">
                <n-input type="password" show-password-on="click" v-model:value="login_form.password"
                    placeholder="Введите пароль" style="width: 280px" />
            </n-form-item>
            <n-form-item>
                <n-button @click="login" style="width: 280px" :loading="loading">
                    Войти
                </n-button>
            </n-form-item>
        </n-form>
        <div class="switch-theme-wrapper">
            <switch-theme />
        </div>
    </div>
</template>

<script setup>
import { 
    NForm,
    NFormItem,
    NInput,
    NButton,
    useNotification 
} from 'naive-ui'

import userApi from '~/api/user.js'

definePageMeta({
    layout: 'empty'
});

// Поля формы
const login_form = ref({
    login: '',
    password: ''
});

// Правила валидации
const rules = {
    login: {
        required: true,
        message: 'Обязательное поле',
        trigger: ['input', 'blur']
    },
    password: [
        {
            required: true,
            message: 'Обязательное поле',
            trigger: ['input', 'blur']
        },
        {
            min: 4,
            message: 'Минимум 4 символа',
            trigger: ['input', 'blur']
        }
    ]
};

// Отправка запроса
const formRef      = ref(null);
const notification = useNotification();
const loading      = ref(false);

function login(e) {
    e.preventDefault();
    
    formRef?.value?.validate(async (errors) => {
        if (!errors) {
            loading.value = true;

            const response = await userApi.login(login_form.value.login, login_form.value.password);

            if (response?.success) {
                const user = useState('current_user');
                user.value = response?.data?.user;

                notification.success({
                    title: 'Выпонен вход под логином: ' + login_form.value.login,
                    duration: 3000,
                });

                await navigateTo('/');
            } else {
                notification.error({
                    title: response?.message ?? 'Произошла ошибка. Повторите попытку позже.',
                    duration: 3000,
                });
            }

           loading.value = false;
        } else {
            notification.error({
                title: 'Заполните обязательные поля.',
                duration: 3000,
            });
        }
    });
}
</script>

<style>
.login-page {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
}

.switch-theme-wrapper {
    position: absolute;
    left: 20px;
    bottom: 20px;
}
</style>