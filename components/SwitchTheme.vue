<template>
    <n-switch
        v-model:value="is_dark_theme"
        @update:value="handleChange"
        size="large"
    >
        <template #unchecked-icon>
            <ph-sun :size="18" color="#FFAA3B" weight="fill" />
        </template>
        <template #checked-icon>
            <ph-moon :size="18" color="#FFAA3B" weight="fill" />
        </template>
    </n-switch>
</template>

<script setup>
import { NSwitch, NIcon } from "naive-ui";
import { PhMoon, PhSun } from "@phosphor-icons/vue";

const is_dark_theme = ref(false);
const local_theme = useCookie("dark_theme");

is_dark_theme.value = local_theme.value;

function handleChange(value) {
    const dark_theme = useState("dark_theme");
    dark_theme.value = value;

    if (value) {
        local_theme.value = "true";
    } else {
        local_theme.value = "";
    }
}
</script>
