<template>
    <n-h1>
        <n-time :time="now" format="dd MMMM HH" />
        <span class="time-separator"> : </span>
        <n-time :time="now" format="mm" />
    </n-h1>
    <!-- <n-h2>
        Время на рабочем месте&nbsp;&nbsp;
        {{ today_time }}
        <span class="time-separator">:</span>
        {{ padNum(today_time.minutes) }}
        <span class="time-separator">:</span>
        {{ padNum(today_time.seconds) }}
    </n-h2>

    <n-button @click="addTimePoint"> Начать рабочий день </n-button>

    <n-timeline>
        <n-timeline-item
            v-for="(point, key) in time_line"
            :title="format(point, 'HH:mm:ss', { ru })"
            :key="key"
            :type="(key + 1) % 2 != 0 ? 'success' : 'error'"
        />
    </n-timeline> -->
    <n-h2> Время на рабочем месте&nbsp;&nbsp; {{ time }} </n-h2>

    <n-button @click="toggleTimer">
        {{
            time_line?.length == 0
                ? "Начать рабочий день"
                : is_running
                ? "Остановить"
                : "Продолжить"
        }}
    </n-button>

    <n-scrollbar x-scrollable class="home-timeline-scrollbar">
        <n-timeline horizontal style="padding-bottom: 15px; margin-top: 30px">
            <n-timeline-item
                v-for="(point, key) in time_line"
                :title="format(point, 'HH:mm:ss', { ru })"
                :key="key"
                :type="(key + 1) % 2 != 0 ? 'success' : 'error'"
            />
        </n-timeline>
    </n-scrollbar>
    <div class="home-content">
        <div class="home-content-tasks">
            <div class="home-content-tasks-header">
                <n-h2 style="margin: 0">Текущие задачи</n-h2>
                <n-button @click="navigateTo('/tasks')">
                    Посмотреть все
                </n-button>
            </div>
            <n-scrollbar class="home-content-lists-scrollbar">
                <n-list hoverable clickable style="padding-right: 15px">
                    <n-list-item
                        v-for="task in active_tasks"
                        class="task-list-item"
                    >
                        <tasks-list-item :item="task" />
                    </n-list-item>
                </n-list>
            </n-scrollbar>
        </div>
        <div class="home-content-comments">
            <n-h2>Последние комментарии</n-h2>
            <n-scrollbar class="home-content-lists-scrollbar">
                <n-list hoverable clickable style="padding-right: 15px">
                    <n-list-item
                        v-for="comment in comments"
                        class="task-list-item"
                    >
                        <home-comment-item :comment="comment" />
                    </n-list-item>
                </n-list>
            </n-scrollbar>
        </div>
    </div>
</template>

<script setup>
import {
    NH1,
    NH2,
    NH6,
    NTime,
    NButton,
    NTimeline,
    NTimelineItem,
    NScrollbar,
    NListItem,
    NList,
} from "naive-ui";
import { format } from "date-fns";
import { ru } from "date-fns/locale/index.js";
import TasksApi from "~/api/tasks.js";

// const now = ref(new Date());

// if (process.client) {
//     setInterval(() => {
//         now.value = new Date();
//         today_time.value = getTime();
//     }, 1000);
// }

// const time_line = ref([]);
// const today_time = ref(getTime());

// function getTime() {
//     let milliseconds = 0;

//     if (time_line.value.length > 0) {
//         for (let index = 0; index < time_line.value.length; index++) {
//             if ((index + 1) % 2 == 0) {
//                 continue;
//             }

//             if (index == time_line.value.length - 1) {
//                 milliseconds +=
//                     now.value.getTime() - time_line.value[index].getTime();
//             } else if (index > 0) {
//                 milliseconds +=
//                     time_line.value[index].getTime() -
//                     time_line.value[index - 1].getTime();
//             }
//         }
//     }

//     let seconds = Math.round((milliseconds / 1000) % 60),
//         minutes = Math.round((milliseconds / (1000 * 60)) % 60),
//         hours = Math.round((milliseconds / (1000 * 60 * 60)) % 24);
//     hours = hours < 10 ? "0" + hours : hours;
//     minutes = minutes < 10 ? "0" + minutes : minutes;
//     seconds = seconds < 10 ? "0" + seconds : seconds;

//     return hours + ":" + minutes + ":" + seconds;
// }

// function addTimePoint() {
//     const point = new Date();

//     time_line.value.push(point);
// }
const seconds = ref(0);
const minutes = ref(0);
const hours = ref(0);
const totalSeconds = ref(0);
const timer = ref(null);
const is_running = ref(false);
const time_line = ref([]);

const time = computed(() => {
    return `${pad(hours.value)} : ${pad(minutes.value)} : ${pad(
        seconds.value
    )}`;
});

function toggleTimer() {
    if (is_running.value) {
        stopTimer();
    } else {
        startTimer();
    }
    is_running.value = !is_running.value;
}

function startTimer() {
    if (!timer.value) {
        timer.value = setInterval(setTime, 1000);
    }
    time_line.value.push(new Date());
}

function stopTimer() {
    if (timer.value) {
        clearInterval(timer.value);
        timer.value = null;
    }
    time_line.value.push(new Date());
}

function setTime() {
    totalSeconds.value++;
    seconds.value = totalSeconds.value % 60;
    minutes.value = Math.floor(totalSeconds.value / 60) % 60;
    hours.value = Math.floor(totalSeconds.value / 3600);
}

function pad(value) {
    return value.toString().padStart(2, "0");
}

const comments = [
    {
        task_id: 1,
        sender: "Васильев Максим",
        task_name:
            "Тестовая задача Тестовая задача Тестовая задача Тестовая задача Тестовая задача Тестовая задача задача Тестовая задача Тестовая задача",
        text: "Какой то комментарий к задаче №1 Какой то комментарий к задаче №1 Какой то комментарий к задаче №1 Какой то комментарий к задаче №1 Какой то комментарий к задаче №1 Какой то комментарий к задаче №1 Какой то комментарий к задаче №1 Какой то комментарий к задаче №1 Какой то комментарий к задаче №1 Какой то комментарий к задаче №1 Какой то комментарий к задаче №1 Какой то комментарий к задаче №1 Какой то комментарий к задаче №1 Какой то комментарий к задаче №1 Какой то комментарий к задаче №1 Какой то комментарий к задаче №1 Какой то комментарий к задаче №1 Какой то комментарий к задаче №1 Какой то комментарий к задаче №1 Какой то комментарий к задаче №1 Какой то комментарий к задаче №1 Какой то комментарий к задаче №1 Какой то комментарий к задаче №1",
        date_send: 1717485010,
    },
    {
        task_id: 2,
        sender: "Кубасов Степан",
        task_name: "Тестовая задача2",
        text: "Какой то комментарий к задаче №2",
        date_send: 1717486230,
    },
    {
        task_id: 3,
        sender: "Бардак Олег",
        task_name: "Тестовая задача3",
        text: "Какой то комментарий к задаче №3",
        date_send: 1717493430,
    },
    {
        task_id: 4,
        sender: "Егоров Георгий",
        task_name: "Тестовая задача4",
        text: "Какой то комментарий к задаче №4",
        date_send: 1717579830,
    },
];

const { data, error } = await TasksApi.getTasks();

const task_array = ref([]);
task_array.value = data;

const active_tasks = computed(() => {
    return task_array.value.filter(
        (task) => task.completion_scores.name == "progress"
    );
});

let socket;

onMounted(() => {
    if (process.client) {
        // socket = new WebSocket("ws://" + window.location.host + "/ws/");
        socket = new WebSocket("ws://localhost:3000/ws/tasks");

        socket.addEventListener("message", (event) => {
            const event_data = JSON.parse(event.data);

            if (event_data?.action == "update") {
                const current_task = task_array.value.findIndex(
                    (task) => task.id == event_data.task.id
                );
                task_array.value[current_task] = Object.assign(
                    task_array.value[current_task],
                    event_data.task
                );
            }
        });
    }
});
</script>

<style>
.time-separator {
    animation: fade infinite 1s;
}

@keyframes fade {
    0% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }

    100% {
        opacity: 1;
    }
}

.home-content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 30px;
}

.home-content-tasks-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 20px;
}

.home-content-comments,
.home-content-tasks {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.home-content .task-list-item:not(:last-of-type) {
    margin-bottom: 20px;
}

.home-timeline-scrollbar {
    min-height: 95px;
    margin-bottom: 20px;
}

.home-content-lists-scrollbar {
    max-height: 550px;
}
</style>
