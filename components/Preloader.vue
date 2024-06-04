<template>
    <div class="preloader" :class="[(loaded ? 'hidden' : ''), (dark_theme ? 'dark' : '')]">
        <slot>
            <div class="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </slot>
    </div>
</template>

<script setup>
const nuxtApp = useNuxtApp();
const loaded  = ref(false);

nuxtApp.hook("page:start", () => {
    loaded.value = false;
});

nuxtApp.hook("page:finish", () => {
    loaded.value = true;
});

const dark_theme = useState('dark_theme');
</script>