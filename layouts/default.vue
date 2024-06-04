<template>
    <n-layout has-sider class="page-layout">
        <n-layout-sider
            collapse-mode="width"
            :collapsed-width="72"
            :width="240"
            show-trigger="arrow-circle"
            :collapsed="collapsed"
            bordered
            @collapse="collapsed = true"
            @expand="collapsed = false"
        >
            <n-layout>
                <n-menu
                    :collapsed="collapsed"
                    :collapsed-width="72"
                    :collapsed-icon-size="22"
                    :options="menuOptions"
                    :render-label="renderMenuLabel"
                    :render-icon="renderMenuIcon"
                    style="height: calc(100vh - 51px)"
                    default-value="home"
                />
                <n-layout-footer
                    :collapsed="collapsed"
                    bordered
                    style="padding: 12px"
                >
                    <n-flex :wrap="false" justify="end">
                        <span
                            class="theme-label"
                            :class="collapsed ? 'hidden' : ''"
                            >Сменить тему</span
                        >
                        <SwitchTheme />
                    </n-flex>
                </n-layout-footer>
            </n-layout>
        </n-layout-sider>
        <n-scrollbar ref="scrollbar" @scroll="scroll_window">
            <n-layout-content content-style="padding: 24px;">
                <div
                    class="user-icon"
                    @click="
                        () => {
                            user_menu = true;
                        }
                    "
                >
                    <n-icon size="20" :component="PhUser" />
                </div>
                <slot />
            </n-layout-content>
        </n-scrollbar>
    </n-layout>
    <n-drawer v-model:show="user_menu" :width="350" placement="right">
        <n-drawer-content footer-class="user-drawer-footer">
            <div class="user-name">
                {{ user.firstname + " " + user.surname }}
            </div>
            <div class="user-role">{{ user?.roles?.name }}</div>
            <template #footer>
                <n-button
                    @click="
                        () => {
                            user_menu = false;
                            update_user = true;
                        }
                    "
                >
                    <template #icon>
                        <n-icon><PhPencil /></n-icon>
                    </template>
                    Изменить
                </n-button>
                <n-button @click="logout">
                    <template #icon>
                        <n-icon><PhSignOut /></n-icon>
                    </template>
                    Выйти
                </n-button>
            </template>
        </n-drawer-content>
    </n-drawer>
    <n-drawer v-model:show="update_user" :width="350" placement="right">
        <n-drawer-content
            closable
            title="Изменение пользователя"
            :native-scrollbar="false"
        >
            <update-user-form
                :user="user"
                @openDrawer="
                    () => {
                        user_menu = true;
                        update_user = false;
                    }
                "
            />
        </n-drawer-content>
    </n-drawer>
</template>

<script setup>
import {
    NIcon,
    NLayout,
    NLayoutSider,
    NLayoutContent,
    NMenu,
    NScrollbar,
    NLayoutFooter,
    NFlex,
    NDrawer,
    NDrawerContent,
    NButton,
} from "naive-ui";

// import {
//  PeopleOutline,
//  DocumentOutline,
//  SettingsOutline,
//  LogOutOutline,
//  PencilOutline,
//  }
//  "@vicons/ionicons5";

import {
    PhUser,
    PhHouseLine,
    PhFolders,
    PhCheckCircle,
    PhSignOut,
    PhPencil,
} from "@phosphor-icons/vue";

import userApi from "~/api/user";

const scrollbar = ref(null);
const scroll = ref(0);
function scroll_window(e) {
    scroll.value = Math.abs(e.target.scrollTop);
}
onMounted(() => {
    const params = {
        behavior: "smooth",
    };

    const offset = 100;

    document.addEventListener("scrollBy", (e) => {
        params.top = e.params.top;
        if (e.params.offset) {
            params.top -= e.params.offset;
        } else {
            params.top -= offset;
        }

        scrollbar.value.scrollBy(params);
    });

    document.addEventListener("scrollTo", (e) => {
        const element = document.querySelector(e?.params?.element);

        if (!element) {
            return;
        }

        const rect = element.getBoundingClientRect();
        params.top = rect.top;
        if (e.params.offset) {
            params.top -= e.params.offset;
        } else {
            params.top -= offset;
        }

        scrollbar.value.scrollBy(params);
    });

    const state_scrollbar = useState("scrollbar");
    state_scrollbar.value = scrollbar.value;
});

const collapsed = ref(false);

const menuOptions = [
    {
        label: "Главная",
        key: "home",
        to: "/",
    },
    {
        label: "Проекты",
        key: "projects",
        to: "/projects",
    },
    {
        label: "Задачи",
        key: "tasks",
        to: "/tasks",
    },
    // {
    //     label: "Пользователи",
    //     key:   "users",
    //     to:    "/users"
    // },
    // {
    //     label: "Настройки",
    //     key:   "settings",
    //     to:    "/settings"
    // },
];

function renderMenuLabel(option) {
    if ("href" in option) {
        return h("a", { href: option.href, target: "_blank" }, () => [
            option.label,
        ]);
    }

    if ("to" in option) {
        return h(defineNuxtLink({}), { to: option.to }, () => [option.label]);
    }
    return option.label;
}

function renderMenuIcon(option) {
    switch (option.key) {
        case "home":
            return h(NIcon, null, { default: () => h(PhHouseLine) });
        case "users":
            return h(NIcon, null, { default: () => h(PeopleOutline) });
        case "projects":
            return h(NIcon, null, { default: () => h(PhFolders) });
        case "tasks":
            return h(NIcon, null, { default: () => h(PhCheckCircle) });
        case "settings":
            return h(NIcon, null, { default: () => h(SettingsOutline) });
        default:
            return h(NIcon, null, { default: () => h(DocumentOutline) });
    }
}

const user_menu = ref(false);
const user = useState("current_user");

const update_user = ref(false);

async function logout() {
    await userApi.logout();
    await navigateTo("/login");
}

watch(
    () => user.value,
    (new_value) => {
        console.log(new_value);
    }
);
</script>

<style>
.n-drawer .n-drawer-content .n-drawer-footer.user-drawer-footer {
    justify-content: space-between;
}
.page-layout {
    height: 100vh;
}

.user-icon {
    height: 40px;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 30px;
    right: 30px;
    z-index: 10;
    color: #fff;
    background-color: #5457f5;
    border-radius: 50%;
    box-shadow: 0 0 20px #5457f5;
    transition: 0.4s;
    cursor: pointer;
}

.user-icon:hover {
    box-shadow: 0 0 10px #6a6cf3;
    background-color: #6a6cf3;
}

.user-icon:active {
    box-shadow: 0 0 10px #4144f3;
    background-color: #4144f3;
}

.theme-label {
    white-space: nowrap;
    position: absolute;
    left: 12px;
    transition: 0.5s;
}

.theme-label.hidden {
    opacity: 0;
    width: 0;
}

.user-name {
    font-size: 40px;
    font-weight: 500;
}

.user-role {
    font-size: 20px;
    opacity: 0.5;
}
</style>
