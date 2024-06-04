<template>
    <nuxt-link class="home-comment-item" :to="'tasks/' + comment?.task_id">
        <n-thing class="home-comment-item-body">
            <n-h4 class="home-comment-item-sender">
                {{ comment?.sender }}
            </n-h4>
            <div class="home-comment-item-task">
                <span>Задача: </span>{{ comment?.task_name }}
            </div>
            <n-divider class="home-comment-item-separator" />
            <div class="home-comment-item-content" v-html="comment?.text"></div>
            <div class="home-comment-item-date">
                <n-time
                    :time="new Date(comment?.date_send * 1000)"
                    format="dd MMMM HH:mm"
                    type="relative"
                />
            </div>
        </n-thing>
    </nuxt-link>
</template>
<script setup>
import { NThing, NH4, NTime, NDivider } from "naive-ui";

const props = defineProps({
    comment: Object,
});
</script>
<style>
.home-comment-item:not(:last-of-type) {
    margin-bottom: 20px;
}

.home-comment-item-body .n-thing-main__content {
    display: flex;
    flex-direction: column;
}

.home-comment-item-task {
    max-width: 100%;
    overflow: hidden;
    line-clamp: 1;
    text-overflow: ellipsis;
    -webkit-line-clamp: 1;
    display: -webkit-box;
    -webkit-box-orient: vertical;
}

.home-comment-item-task span {
    font-weight: 500;
}

.home-comment-item-separator.n-divider:not(.n-divider--vertical) {
    margin: 10px 0;
}

.home-comment-item-content {
}
.home-comment-item-date {
    align-self: flex-end;
    margin-top: 5px;
}
</style>
