<template>
    <NuxtLink :to="'projects/' + props.item?.id">
        <n-thing :title="props.item?.name">
            <div class="table-project-item-body">
                <div class="table-project-item-body-col">
                    <div class="table-project-item-body-col-header">
                        Заказчик
                    </div>
                    <div class="table-project-item-body-col-content">
                        {{ props.item?.customer ?? "-" }}
                    </div>
                </div>
                <div class="table-project-item-body-col">
                    <div class="table-project-item-body-col-header">
                        Ответственный
                    </div>
                    <div class="table-project-item-body-col-content">
                        <template v-if="props.item?.employee">
                            {{ props.item?.employee?.firstname }}
                            {{ props.item?.employee?.fathername }}
                        </template>
                        <template v-else> - </template>
                    </div>
                </div>
                <div class="table-project-item-body-col">
                    <div class="table-project-item-body-col-header">Стадия</div>
                    <div class="table-project-item-body-col-content">
                        {{
                            props.item
                                ?.project_stages_projects_stage_idToproject_stages
                                ?.name ?? "-"
                        }}
                    </div>
                </div>
                <div class="table-project-item-body-col">
                    <div class="table-project-item-body-col-header">
                        Дедлайн
                    </div>
                    <div class="table-project-item-body-col-content">
                        <template v-if="Number(props.item?.deadline)">
                            <span
                                :style="{
                                    color: deadlineColor(
                                        Number(props.item?.deadline)
                                    ),
                                    transition: '.5s',
                                }"
                            >
                                <n-time
                                    :time="
                                        new Date(
                                            Number(props.item?.deadline) * 1000
                                        )
                                    "
                                    format="dd MMMM yyyy HH:mm"
                                    type="relative"
                                >
                                </n-time>
                            </span>
                        </template>
                        <template v-else> - </template>
                    </div>
                </div>
            </div>
        </n-thing>
    </NuxtLink>
</template>

<script setup>
import { NThing, NTime } from "naive-ui";

const now = ref(new Date());
const days_before_deadline = ref(new Date(now.value - 259200000));

const props = defineProps({
    item: Object,
});

// const deadline = computed(() => {
//     const is_date = Date.parse(props.item?.deadline);
//     if (is_date) {
//         return props.item?.deadline;
//     }
//     return null;
// });

if (process.client) {
    setInterval(() => {
        now.value = new Date();
        days_before_deadline.value = new Date(now.value - 259200000);
    }, 1000);
}

const dark_theme = useState("dark_theme");

function deadlineColor(timestamp) {
    let date = new Date(timestamp * 1000);
    if (props.item?.is_archive != "1") {
        //3 дня до сдачи
        if (date < now.value && date > days_before_deadline.value) {
            if (dark_theme.value) {
                return "#f2c97d";
            } else {
                return "#f0a020";
            }
        }

        //Просрочен
        else if (date < now.value) {
            return "#D03A52";
        }

        //не просрочен
        else {
            return "";
        }
    }
}
</script>
<style>
.table-project-item-body {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
}

.table-project-item-body-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
}

.table-project-item-body-col:nth-child(1) {
    align-items: flex-start;
}

.table-project-item-body-col:nth-child(4) {
    align-items: flex-end;
}

.table-project-item-body-col-header {
    font-weight: 500;
}

.table-project-item-body-col-content {
}
</style>
