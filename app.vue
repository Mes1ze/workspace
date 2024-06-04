<template>
    <div class="app-wrapper" :class="dark_theme ? 'dark-theme' : ''">
        <n-config-provider :theme="dark_theme ? darkTheme : null" :theme-overrides="themeOverrides" :locale="ruRU" :date-locale="dateRuRU">
            <n-message-provider>
                <n-notification-provider placement="bottom-right">
                    <n-dialog-provider>
                        <Preloader />
                        <NuxtLayout>
                            <NuxtPage />
                        </NuxtLayout>
                    </n-dialog-provider>
                </n-notification-provider>
            </n-message-provider>
        </n-config-provider>
    </div>
</template>
  
<script setup>
import {
    ruRU,
    dateRuRU,
    darkTheme,
    NConfigProvider,
    NMessageProvider,
    NNotificationProvider,
    NDialogProvider,
} from 'naive-ui'

const themeOverrides = {
    common: {
        primaryColor: '#5457F5',
        primaryColorHover: '#6a6cf3',
        primaryColorPressed: '#4144f3',
        primaryColorSuppl: '#5457F5',
    },
}

useSeoMeta({
    title: 'Твои задачи'
});

const dark_theme = useState('dark_theme');
const local_theme = useCookie('dark_theme');

dark_theme.value = local_theme.value; 

const loading = useState('loading');
loading.value = true;

onMounted(() => {
    loading.value = false;
})
</script>
  
<style>
* {
    box-sizing: border-box;
}

body {
    margin: 0;
    background-color: #FFF;
    color: #101014;
}
</style>