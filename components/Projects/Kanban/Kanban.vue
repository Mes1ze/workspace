<template>
    <n-scrollbar x-scrollable>
        <n-space class="kanban" :size="0" :wrap="false">
            <ProjectsKanbanColumn
                v-for="(column, index) in kanban"
                :column="column"
                :index="index"
                @addNewColumn="addNewColumn"
                @removeColumn="removeColumn"
                @updateColumn="updateColumn"
                :random_id="random_id"
            />
        </n-space>
    </n-scrollbar>
</template>

<script setup>
import { NScrollbar, NSpace } from "naive-ui";

let random_id = ref(1);

const kanban = reactive([
    {
        //   column_id: 0,
        task_input: false,
        is_edit: false,
        header: "Первая колонка",
        items: [
            {
                id: 0,
                title: "Просто какое то задание Просто какое то задание Просто какое то задание",
            },
            {
                id: 1,
                title: "Просто какое то задание Просто какое то задание Просто какое то задание",
            },
            {
                id: 2,
                title: "Просто какое то задание Просто какое то задание Просто какое то задание",
            },
            {
                id: 3,
                title: "Просто какое то задание Просто какое то задание Просто какое то задание",
            },
            {
                id: 4,
                title: "Просто какое то задание Просто какое то задание Просто какое то задание",
            },
            {
                id: 5,
                title: "Просто какое то задание Просто какое то задание Просто какое то задание",
            },
            {
                id: 6,
                title: "Просто какое то задание Просто какое то задание Просто какое то задание",
            },
            {
                id: 7,
                title: "Просто какое то задание Просто какое то задание Просто какое то задание",
            },
            {
                id: 8,
                title: "Просто какое то задание Просто какое то задание Просто какое то задание",
            },
            {
                id: 9,
                title: "Просто какое то задание Просто какое то задание Просто какое то задание",
            },
        ],
    },
    {
        task_input: false,
        is_edit: false,
        header: "Вторая колонка",
        items: [
            {
                id: 10,
                title: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium voluptatibus ipsum minus pariatur ipsam et, eos repellendus obcaecati unde quibusdam ratione ex veniam voluptas quod asperiores mollitia saepe, placeat illum.",
            },
        ],
    },
    // {
    //     task_input: false,
    //     header: "Третья колонка",
    //     items: [
    //         {
    //             id: 11,
    //             title: "4",
    //             deadline: "1231",
    //             description: "999",
    //         },
    //     ],
    // },
    //  {
    //      task_input: false,
    //      header: "Четвёртая колонка",
    //      items: [
    //          {
    //              id: 12,
    //              title: "5",
    //          },
    //      ],
    //  },
    //  {
    //      task_input: false,
    //      header: "Пятая колонка",
    //      items: [
    //          {
    //              id: 13,
    //              title: "6",
    //          },
    //      ],
    //  },
    //  {
    //      task_input: false,
    //      header: "Шестая колонка",
    //      items: [
    //          {
    //              id: 14,
    //              title: "7",
    //          },
    //      ],
    //  },
]);

kanban.forEach((column) => {
    column.items.forEach((card) => {
        random_id.value = randomInteger(
            random_id.value + 1,
            random_id.value + 10
        );
        card.id = random_id.value;
    });
});

function addNewColumn(new_column, index) {
    kanban.splice(index + 1, 0, new_column);
    kanban[index + 1].is_edit = true;
}

function updateColumn(column_title, index) {
    kanban[index].is_edit = false;
    kanban.find((column, column_index) => {
        if (column_index == index) {
            column.header = column_title;
        }
    });
}

function removeColumn(column_id) {
    kanban.find((column, index) => {
        if (column_id == index) {
            column.items = [];
            kanban.splice(column_id, 1);
        }
    });
    //  kanban.forEach((column_item) => {
    //  if (column_item?.items.length) {
    //      return;
    //  }
    //  });
}
</script>

<style>
.n-scrollbar:has(.kanban) {
    padding: 0;
    padding-bottom: 30px;
}

.kanban-column .n-scrollbar:has(.kanban-column-body) {
    padding: 0;
    padding-right: 10px;
}

.n-scrollbar > .n-scrollbar-container > .n-scrollbar-content {
    height: 100%;
}

.kanban {
    position: relative;
    padding-top: 8px;
    z-index: 1;
    height: 100%;
}
.kanban > div {
    border-left: 1px dashed #000;
}

.kanban > div:last-of-type {
    border-right: 1px dashed #000;
}
.kanban-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: max-content;
    min-width: 300px;
    max-width: 300px;
    padding: 0 5px;
    position: relative;
    box-sizing: border-box;
    transform: translateZ(0);
    height: 100%;
}
.kanban-column-header {
    display: flex;
    flex-direction: column;
    gap: 3px;
    position: relative;
    z-index: 9;
}
.kanban-column-title {
    display: block;
    position: relative;
    width: 100%;
    white-space: nowrap;
}

.kanban-column-title-info {
    display: flex;
    align-items: center;
    position: relative;
    z-index: 9;
    padding: 0 0 0 10px;
    opacity: 1;
    transition: 0.2s;
    z-index: 99;
    background-color: #5457f5;
}
.kanban-column-title-text {
    display: flex;
    flex: 1;
    overflow: hidden;
    margin: 0 4px 0 0;
    vertical-align: middle;
    font-size: 12px;
    color: #fff;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.kanban-column-title-text-inner {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.kanban-column-title-total-item {
    flex: 1;
    margin: 0 0 0 2px;
    font-size: 11px;
    color: #fff;
    opacity: 0.7;
}
.kanban-column-title-total-item:before {
    content: "(";
}
.kanban-column-title-total-item:after {
    content: ")";
}
.kanban-column-title-text-edit-block {
    display: none;
    width: 100%;
    justify-content: space-between;
    padding: 10px 0;
}
.kanban-column-title-text-edit-block.active {
    display: flex;
}
.static-kanban-column-title-text.hidden {
    display: none;
}

.kanban-column-title-input-edit {
    display: inline-block;
    width: calc(100% - 70px);
    margin: 0 5px 0 0;
    vertical-align: middle;
    background: #fff;
    border: 1px solid #eaecef;
    padding: 0 6px;
    font-size: 12px;
    color: #525c68;
}

.kanban-column-add-item-button {
    display: flex;
    width: 100%;
    padding: 10px;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    line-height: normal;
    cursor: pointer;
    background-color: rgba(0, 0, 0, 1);
    color: #fff;
    transition: 0.2s;
    border-radius: 40px;
    gap: 0;
}
.kanban-column-add-item-button span {
    margin-left: 5px;
}

.kanban-column-add-item-block {
    display: none;
}

.kanban-column-add-item-block.active {
    display: flex;
}

.kanban-column-add-item-button-inner {
    display: flex;
    align-items: center;
}

.kanban-column-add-item-button-inner.hidden {
    display: none;
}
.kanban-column-add-item-btn {
    padding: 5px;
    height: auto;
}
.kanban-column-add-item-btn span {
    margin: 0;
    line-height: 1;
    text-transform: uppercase;
    /* color: #fff; */
}

.kanban-column:hover .kanban-column-add-item-button-text {
    width: 110px;
}
.kanban-column-add-item-button-text {
    display: inline-block;
    overflow: hidden;
    width: 0;
    vertical-align: middle;
    font-size: 13px;
    color: #fff;
    transition: 0.3s;
}
.kanban-column-body {
    flex: 1;
    padding: 10px 0 40px;
    /* overflow-x: hidden;
    overflow-y: auto; */
    position: relative;
    opacity: 1;
    z-index: 99;
    transition: 0.2s;
}
.kanban-column-items {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 240px;
    max-width: 340px;
    padding: 0 3px;
    position: relative;
    border-radius: 3px;
    box-sizing: border-box;
}
.kanban-item {
    display: block;
    position: relative;
    padding: 0 0 6px 0;
    margin: 0 1px 0 -1px;
}

.kanban-tasks-group {
    padding-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: relative;
    border-radius: 2px;
    user-select: none;
    max-height: 70vh;
    height: 100%;
}

.kanban-loader {
}

.static-kanban-column-title-text {
    display: flex;
    align-items: center;
    position: relative;
    z-index: 9;
    padding: 0 0 0 10px;
    opacity: 1;
    transition: 0.2s;
    z-index: 99;
    background-color: #5457f5;
}
</style>
