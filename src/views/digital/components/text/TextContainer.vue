<!--数字人文本容器-->
<script lang="ts" setup>
import { debounce } from 'lodash-es'
import { useUserStore } from '@/store/modules/user'
import { getTextManageListPage } from "@/api/digital";
import { CardText } from "./";
import { Search } from '@element-plus/icons-vue'
defineOptions({
  name: 'TextContainer'
})
const userStore = useUserStore()
const porps = defineProps({
  className: {
    type: [String, Object, Array],
    default: () => {
      return {}
    }
  },
  align: {
      type: String,
      default: 'left'
  },
  id: {
    type: String,
    default: '-1'
  },
  pagination: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: '' // null 查询所有 1: 3:失败 4:成功
  },
  showSearch: {
    type: Boolean,
    default: false
  }
})
const selectId = ref(porps.id)
const loading = ref(false)
const alignClass = computed(() => {
    return {
      'justify-start': porps.align === 'left',
      'justify-right': porps.align === 'right',
      'justify-center': porps.align === 'center'
    }
  })
const emit = defineEmits(['onClick'])
const data = ref([])
const pageParams = reactive({
  total: 0,
  pageNo: 1,
  pageSize: 10
})
const copywriteTitle = ref('')
const onSearch = () => {
  pageParams.pageNo = 1
  getList()
}
const onItemClick = (item: any) => {
  selectId.value = item.id
  item.copywriteId = item.id
  emit('onClick', item)
}
const getList = debounce(() => {
  loading.value = true
  getTextManageListPage({ publicLibType: '0', copywriteStatus: porps.status, oprStaff: userStore.getUser.id, ...pageParams, copywriteTitle: copywriteTitle.value }).then(res => {
    data.value = res.list
    pageParams.total = res.total
  }).catch(err => {
    console.log(err)
  }).finally(() => {
    loading.value = false
  })
},500)
onMounted(() => {
  getList()
})
</script>

<template>

<div v-loading="loading">
  <div v-if="data.length>0" class="flex flex-wrap gap-2xl mt-10px content-start" :class="alignClass">
    <el-input v-if="showSearch" v-model="copywriteTitle" placeholder="请输入文案标题搜索" clearable @clear="onSearch">
      <template #append>
        <el-button :icon="Search"  @click="onSearch"/>
      </template>
      </el-input>
    <CardText class="w-240px" :class="className" v-for="(item, index) in data" :key="index" :data="item" @click="onItemClick(item)" :select-id="selectId"/>

    <!-- 分页 -->
    <Pagination
    class="w-full justify-end"
    v-if="pagination"
        :total="pageParams.total"
        v-model:page="pageParams.pageNo"
        v-model:limit="pageParams.pageSize"
        @pagination="getList"
      />
  </div>
  <el-empty class="h-150px" :image-size="50" description="暂无数据" v-else/>
  </div>

</template>
