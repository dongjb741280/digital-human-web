<!--导航条-->
<script lang="ts" setup>

defineOptions({
    name: 'NavTab'
})
const router = useRouter()
const route = useRoute();
const izShowTabs = ref<any>(true);
const title = ref('');


/** 初始化 **/
onMounted(() => {
    matchActive();
    izShowTabs.value = showTabs();

})

watch(
    () => route.path,
    (newPath, oldPath) => {
        matchActive(); // 调用 matchActive
        izShowTabs.value = showTabs(); // 调用 showTabs
    }
);

// 导航项
const navItems = ref([{ title: '直播', path: '/h5/live-notice' }, { title: '课程', path: '/h5/training-lesson' }]);
// 当前选中的导航项索引
const activeIndex = ref(0);

const setActive = (index, path) => {
    activeIndex.value = index;
    router.push({ path: path })
}
// 匹配当前路由对应的导航项
const matchActive = () => {
    const itemIndex = navItems.value.findIndex(item => item.path === route.path);
    activeIndex.value = itemIndex;
    title.value = '';
    if (itemIndex != -1) {
        title.value = navItems.value[itemIndex].title;
    }

}

const showTabs = () => {
    const isExist = navItems.value.some(item => item.path === route.path);
    return isExist;
}



defineExpose({
    title,
});


</script>


<template>
    <div class="navbar" v-if="izShowTabs">
        <div class="item_container">
            <div class="item" v-for="(item, index) in navItems" :key="index"
                :class="[ { active: activeIndex === index }]" @click="setActive(index, item.path)">
                {{ item.title }}</div>
        </div>
        <!-- <a
            v-for="(item, index) in navItems"
            :key="index"
            :class="['nav-item', { active: activeIndex === index }]"
            @click="setActive(index, item.path)"
        >
            {{ item.title }}
        </a> -->
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
    width: 100%;
    top: 50px;
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