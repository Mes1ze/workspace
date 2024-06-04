<template>
    <div @click="open_message_task = true">
        <n-thing :title="'#' + props.item?.id + ' - ' + props.item?.name">
            <div class="home-task-list-item">
                <div class="home-task-list-item-col">
                    <div class="home-task-list-item-col-header">Проект</div>
                    <div class="home-task-list-item-col-content">
                        {{ props.item?.project_id ?? "Пусто" }}
                    </div>
                </div>
                <div class="home-task-list-item-col">
                    <div class="home-task-list-item-col-header">Дедлайн</div>
                    <div class="home-task-list-item-col-content">
                        <n-time
                            :time="new Date(props.item.deadline_time * 1000)"
                            format="dd MMMM HH:mm"
                            type="relative"
                        />
                    </div>
                </div>
                <div class="home-task-list-item-col">
                    <div class="home-task-list-item-col-header">
                        Потрачено времени
                    </div>
                    <div class="home-task-list-item-col-content">
                        <!-- <n-time
                            :time="
                                new Date(props.item?.time_to_complete * 1000)
                            "
                            format="HH:mm"
                            type="relative"
                        /> -->
                        из
                        <n-time
                            :time="new Date(props.item.time_on_task * 1000)"
                            format="HH:mm"
                            type="relative"
                        />
                    </div>
                </div>
                <div class="home-task-list-item-col">
                    <div class="home-task-list-item-col-header">Важность</div>
                    <div class="home-task-list-item-col-content">
                        {{ props.item?.importance }}
                    </div>
                </div>
            </div>
        </n-thing>
    </div>
    <n-drawer
        v-model:show="open_message_task"
        width="100%"
        style="max-width: calc(100% - 450px)"
        :on-update:show="cancelUpdate"
    >
        <n-drawer-content closable :native-scrollbar="false">
            <template #header>
                <div class="task-drawer-header">
                    Задача {{ "#" + item?.id }}
                </div>
            </template>
            <div class="home-task-messages">
                <div class="home-task-messages-item" v-for="item in data">
                    <h2 class="home-task-messages-item-title">коментарий номер {{ item.id }}</h2>
                    <p class="home-task-messages-item-content">{{ item.content }}</p>
                    <p class="home-task-messages-item-date">{{ item.datea}}  {{ item.time }}</p>
                </div>
                <n-form
                    ref="formRef"
                    :label-width="45"
                    :model="formValue"
                    :rules="rules"
                    class="home-task-messages-form"
                >
                    <n-form-item path="text">
                        <n-input
                            v-model:value="formValue.text"
                            type="textarea" 
                            placeholder="Введите комаентарий"
                        />
                    </n-form-item>
                </n-form>
            </div>
            <template #footer>
                <n-button @click="createMessage(formValue.text)">
                    <template #icon>
                        <n-icon><PhPencil /></n-icon>
                    </template>
                    Добавить комаентарий
                </n-button>
            </template>
        </n-drawer-content>
    </n-drawer>
</template>

<script setup>
import {
    NThing,
    NDrawer,
    NDrawerContent,
    NButton,
    NIcon,
    NTime,
    NInput,
    NForm, 
    NFormItem, 
} from "naive-ui";
import { PhPencil } from "@phosphor-icons/vue";
const props = defineProps({
    item: null
})
const formRef = ref("");
const formValue = ref({
    text: "",
});
const message_input = ref("")
const data = [
    {
        id:1,
        content:"jhwgfvbaoknfwe  we r ew g df hhwerryuhor  werugbyehdf",
        date:"дата",
        time:"11:42",
    },
    {
        id:2,
        content:"qwertyuiop[ sdfghjk zxcvbnm,]",
        date:"дата",
        time:"04:20",
    },
    {
        id:3,
        content:"jhfgu u  woua f ahwefhnoiaj",
        date:"дата",
        time:"18:46",
    },
    {
        id:4,
        content:"234ij872v uh2rhh23h9 ihw73 nuw34t",
        date:"дата",
        time:"13:00",
    },
]
const hour_now = ref(null)
const minute_now = ref(null)
function createMessage(text) {
    let last_id = data.at(-1).id
    let currentDate = new Date();
    if (currentDate.getHours() < 10){
        hour_now.value = "0" + currentDate.getHours().toString()
    }else{
        hour_now.value =  currentDate.getHours().toString()
    }
    if (currentDate.getMinutes() < 10){
        minute_now.value = "0" + currentDate.getMinutes().toString()
    }else{
        minute_now.value =  currentDate.getMinutes().toString()
    }
    data.push({
        id: last_id + 1,
        content: text,
        date:"дата",
        time:`${hour_now.value}:${minute_now.value}`,
    })
}
const open_message_task = ref(false);

const updated_mode = ref(false);

function updateTask() {
    updated_mode.value = true;
}

function cancelUpdate(value) {
    if (!value) {
        open_message_task.value = false;
        updated_mode.value = false;
    } else {
        updated_mode.value = false;
    }
}

const task_is_save = ref(false);

function saveTask() {
    task_is_save.value = true;
}
</script>

<style>
.home-task-messages-form{
    width: 50%;
}

.home-task-messages{
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items:flex-end;
}

.home-task-messages-item{
    background-color: lightgrey;
    border-radius: 5px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: fit-content;
}

.home-task-messages-item-title,
.home-task-messages-item-date,
.home-task-messages-item-content{
    margin: 0;
}

.home-task-messages-item-date{
    align-self: flex-end;
}
.home-task-list-item {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
}

.home-task-list-item-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
}

.home-task-list-item-col:nth-child(1) {
    align-items: flex-start;
}

.home-task-list-item-col:nth-child(4) {
    align-items: flex-end;
}

.home-task-list-item-col-header {
    font-weight: 500;
}
</style>=