<template>
  <div class="page">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-tabs v-model="activeTab" class="tab-align-left">
          <el-tab-pane label="数字人管理" name="my-clones" />
        </el-tabs>
      </el-col>
      <el-col :span="8" style="text-align: right">
        <el-button type="primary" @click="navigateToTargetPage(true)">立即制作</el-button>
      </el-col>
    </el-row>
    <el-row type="flex" justify="start" :gutter="20">
      <el-radio-group v-model="radioValue">
        <el-radio value="0" border>我的数字人</el-radio>
        <el-radio value="1" border>公共库</el-radio>
      </el-radio-group>
    </el-row>
    <!-- 添加一个带有间隔样式的div -->
    <div class="row-gap"></div>
    <el-row v-if="radioValue === '0'" :gutter="20">
      <card-container :pagination="true" :type="0" :more="true" class="w-full" />
    </el-row>
    <el-row v-if="radioValue === '1'" :gutter="20">
      <card-container :pagination="true" :type="1" :more="true" class="w-full" />
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue' // 引入ref以创建响应式数据
import { useRouter } from 'vue-router'
import * as DigitalPersonApi from '@/api/ai/digitalPerson'
import { DigitalPersonVO } from '@/api/ai/digitalPerson'
import CardContainer from '@/views/digital/components/card/CardContainer.vue'

/** 初始化 **/
onMounted(async () => {
  //await getDigitalPersonPage()
  //await getPublicPersonPage()
})

const router = useRouter()
const activeTab = ref('my-clones')
const radioValue = ref('0') // 草稿/成品/我的视频/公共
const loading = ref(true) // 列表的加载中
const digitalPersonList = ref<DigitalPersonVO[]>([]) // 列表的数据
const publicPersonList = ref<DigitalPersonVO[]>([]) // 列表的数据
const cardClass = 'w-230px h-280px'

const total = ref(0) // 列表的总页数

/*const navigateToTargetPage = () => {
  router.push('/digital/CreateDigitalAvatar' );
};*/

const navigateToTargetPage = (isNew: boolean) => {
  router.push({
    name: '/digital/createDigitalAvatar',
    query: { isNew: isNew.toString() }
  })
}

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  queryType: '0'
})

const publicParams = reactive({
  pageNo: 1,
  pageSize: 10,
  queryType: '1'
})

/** 查询列表 */
const getDigitalPersonPage = async () => {
  loading.value = true
  try {
    const data = await DigitalPersonApi.getAiDhHumanPage(queryParams)
    digitalPersonList.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const getPublicPersonPage = async () => {
  loading.value = true
  try {
    const data = await DigitalPersonApi.getAiDhHumanPage(publicParams)
    publicPersonList.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const onItemClick = (item: any) => {}

const selectedTab = ref('my-clones') // 使用ref定义selectedTab

// 定义父组件中的方法
const handleCreate = () => {
  console.log('创作按钮点击事件处理')
  // 这里写你的处理逻辑
}
</script>

<style lang="scss" scoped>
.className {
  width: 220px !important;
  height: 310px !important;
}

.page {
  margin-left: 10px;
}

.row-gap {
  height: 20px; /* 设置高度为20px以创建间隔 */
}

.custom-margin {
  margin-right: 40px;
}

.text-align-left {
  text-align: left;
}

.centered-names {
  text-align: center; /* 文本水平居中 */
  /* 如果需要垂直居中，且知道容器高度，可以使用以下方法：
  display: flex;
  justify-content: center;
  align-items: center;
  height: 您的容器高度; */
}

.el-card {
  display: flex; /* 启用Flex布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  height: 100%; /* 确保卡片内容区域撑满高度，以便垂直居中生效 */
}

.avatar {
  width: 230px; /* 指定宽度 */
  height: 320px; /* 指定高度 */
  object-fit: cover; /* 保持图片不失真并填充容器 */
  max-width: 100%; /* 限制图片最大宽度为卡片内容区宽度，保持响应式 */
}

:deep(.el-radio__inner) {
  display: none;
}

[v-cloak] {
  display: none !important;
}

/* 添加这一部分来给两个列添加边框 */
.row > .col-md-6 {
  border-right: 1px solid #ccc; /* 添加右侧边框 */
  border-bottom: none; /* 确保底部没有额外的边框（如果需要的话） */
}

.row > .col-md-6:last-child {
  /* 针对最后一个列移除右侧边框以避免多余线条 */
  border-right: none;
}
</style>
