<!--导航条-->
<script lang="ts" setup>
defineOptions({
    name: 'NavTab'
})

const izShowTabs = ref<any>(true);
const title = ref('直播'); // 默认设置为直播

const emit = defineEmits(['update:activeTab'])

// 导航项
const navItems = ref([{ title: '直播' }, { title: '课程' }]);
// 当前选中的导航项索引
const activeIndex = ref(0);

const setActive = (index) => {
    activeIndex.value = index;
    title.value = navItems.value[index].title;
    emit('update:activeTab', navItems.value[index].title);
}

defineExpose({
    title,
});
</script>

<template>
    <div class="navbar" v-if="izShowTabs">
        <div class="item_container">
            <div class="item" v-for="(item, index) in navItems" :key="index"
                :class="[ { active: activeIndex === index }]" @click="setActive(index)">
                {{ item.title }}</div>
        </div>
    </div>
</template>



<style lang="scss" scoped>
/* 基本样式重置 */
body,
ul,
li {
    margin: 0;
    padding: 0;
    list-style: none;
}

/* 导航栏容器 */
.navbar {
    display: flex;
    justify-content: left;
    /* 导航项居中排列 */
    align-items: left;
    background-color: #ffffff;
    // width: 100%;
    // top: 50px;
    z-index: 1000;
    padding: 12px;
    /* 确保导航栏在最上层 */
}

/* 导航项样式 */
.nav-item {
    color: #000000;
    /* 文字颜色为黑色 */
    font-size: 16px;
    /* 字体大小 */
    text-decoration: none;
    padding: 8px 20px;
    /* 内边距 */
    border-radius: 4px;
    /* 圆角效果 */
    transition: background-color 0.3s ease;
    /* 添加过渡效果 */
}



/* 当前选中导航项样式 */
.nav-item.active {
    font-size: 20px;
    /* 选中项文字颜色 */
    font-weight: bold;
}

.item_container {
    display: flex;
    border: 1px solid #FFEFEF;
    border-radius: 5px;
    overflow: hidden;
    color: #666666;
    font-size: 15px;
    box-sizing: border-box;
    .item {
        padding: 0 20px;
        height: 29px;
        background: #FFEFEF;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        &.active {
            background: #fff;
            color: #333333;
            font-weight: bold;
            font-size: 16px;
            border-radius: 5px;
            border: 1px solid #FFEFEF;
          
        }
    }
}
</style>